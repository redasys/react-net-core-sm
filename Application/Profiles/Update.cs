using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.DisplayName) && string.IsNullOrEmpty(request.Bio)) {
                    throw new RestException(HttpStatusCode.BadRequest, new { Bio = "At least one field must have value" });
                }
                var user = await _context.Users.FindAsync(request.Id);

                if(user.UserName!=_userAccessor.GetCurrentUserName()) throw new RestException(HttpStatusCode.Unauthorized, new {User="You are not authorized to edit this profile"});

                user.Bio = string.IsNullOrEmpty(request.Bio) ? user.Bio : request.Bio;

                user.DisplayName = string.IsNullOrEmpty(request.DisplayName) ? user.DisplayName : request.DisplayName;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Save Failed");
            }
        }
    }
}