namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    
    [Authorize]
    public class GeofenceGroupController : BaseApiController
    {
        private IRepository<GeofenceGroup> repository;

        public GeofenceGroupController(IRepository<GeofenceGroup> repository)
        {
            this.repository = repository;
        }

        public IEnumerable<GeofenceGroup> Get()
        {
            return this.repository.GetAll()
               .Where(item => item.User == null || item.User.Id == CurrentUser.Id);
        }

        public HttpResponseMessage Post(GeofenceGroup geofenceGroup)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            geofenceGroup.UserId = CurrentUser.Id;
            this.repository.Save(geofenceGroup);
            return Request.CreateResponse(HttpStatusCode.Created, geofenceGroup);
        }

        public HttpResponseMessage Put(GeofenceGroup geofenceGroup, int id)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            GeofenceGroup group = this.repository.GetById(id);
            if (group == null || group.User.Id != CurrentUser.Id)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            group.Name = geofenceGroup.Name;
            this.repository.Save(group);

            return Request.CreateResponse(HttpStatusCode.Accepted, group);
        }

        public HttpResponseMessage Delete(int id)
        {
            GeofenceGroup item = this.repository.GetById(id);
            if (item != null && item.User.Id == CurrentUser.Id)
            {
                if (item.Geofences.Count == 0)
                {
                    this.repository.Delete(item);
                    return this.OkResult();
                }
                else
                {
                    return this.OkResult<object>(new { Success = false });
                }
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }
    }
}
