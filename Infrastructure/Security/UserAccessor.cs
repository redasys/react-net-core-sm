using System.Security.Claims;
using System.Linq;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _ctx;
        public UserAccessor(IHttpContextAccessor ctx)
        {
            _ctx = ctx;
        }

        public string GetCurrentUserName()
        {
            return _ctx.HttpContext.User?.Claims?.FirstOrDefault(x=>x.Type==ClaimTypes.NameIdentifier)?.Value;
        }
    }
}