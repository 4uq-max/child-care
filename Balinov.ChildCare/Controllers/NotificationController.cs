namespace Balinov.ChildCare.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;

    public class NotificationController : BaseApiController
    {
        private IRepository<Notification> repository;

        public NotificationController(IRepository<Notification> repository)
        {
            this.repository = repository;
        }

        public IEnumerable<Notification> Get()
        {
            var notifications = this.repository.GetAll()
                    .Where(item => item.UserId == CurrentUser.Id)
                    .OrderByDescending(item => item.Date);
            return notifications;
        }

        public HttpResponseMessage Delete(int id)
        {
            Notification item = this.repository.GetById(id);
            if (item != null && item.User.Id == CurrentUser.Id)
            {
                this.repository.Delete(item);
                return this.OkResult();
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        [AllowAnonymous]
        [Route("api/notification/getnotifications")]
        public IEnumerable<object> GetNotifications(int userId, int timestamp)
        {
            DateTime unixDate = new DateTime(1970, 1, 1);
            DateTime date = unixDate.AddSeconds(timestamp);

            var notifications = this.repository.GetAll()
                .Where(item => item.UserId == userId && item.Date > date)
                .Select(item => new
                {
                    item.Message,
                    TimeStamp = (int)(item.Date - unixDate).TotalSeconds
                });
            return notifications;
        }
    }
}
