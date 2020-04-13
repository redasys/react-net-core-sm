using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command cmd)
        {
            string userName = GetUserName();
            cmd.UserName = userName;
            var comment = await _mediator.Send(cmd);

            await Clients.Group(cmd.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }
        
        public async Task AddToGroup(string groupName){
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            string userName = GetUserName();
            
            await Clients.Group(groupName).SendAsync("Send", $"{userName} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName){
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            
            string userName = GetUserName();
            
            await Clients.Group(groupName).SendAsync("Send", $"{userName} has left the group");
        }

        private string GetUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

    }
}