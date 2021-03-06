using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDTO>();
            CreateMap<UserActivity, AttendeeDTO>().ForMember(x=>x.UserName, y=>y.MapFrom(f=>f.AppUser.UserName))
                .ForMember(x=>x.DisplayName, y=>y.MapFrom(f=>f.AppUser.DisplayName))
                .ForMember(x=>x.Image, y=>y.MapFrom(f=>f.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url));
        }
    }
}