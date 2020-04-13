using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>().ForMember(x => x.UserName, o => o.MapFrom(s => s.Author.UserName));
            CreateMap<Comment, CommentDto>().ForMember(x => x.DisplayName, o => o.MapFrom(s => s.Author.DisplayName));
            CreateMap<Comment, CommentDto>().ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}