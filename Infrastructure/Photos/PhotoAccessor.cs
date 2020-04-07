using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );


            _cloudinary = new Cloudinary(acc);
        }
        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var result = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var p = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    };
                    result = _cloudinary.Upload(p);
                }
            }

            if (result.Error != null)
            {
                throw new Exception(result.Error.Message);
            }

            return new PhotoUploadResult
            {
                PublicId = result.PublicId,
                Url = result.SecureUri.PathAndQuery
            };
        }

        public string DeletePhoto(string id)
        {
            var p = new DeletionParams(id);
            var result = _cloudinary.Destroy(p);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}