namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    using Balinov.ChildCare.Models;
    
    [Authorize]
    public class GeofenceGroupController : BaseApiController
    {
        private IRepository<GeofenceGroup> repository;

        public GeofenceGroupController(IRepository<GeofenceGroup> repository)
        {
            this.repository = repository;
        }

        public IEnumerable<GeofenceGroupModel> Get()
        {
            return this.repository.GetAll()
               .Where(item => item.User == null || item.User.Id == CurrentUser.Id)
               .Project()
               .To<GeofenceGroupModel>();
        }

        public HttpResponseMessage Post(GeofenceGroupModel geofenceGroup)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            GeofenceGroup item = Mapper.Map<GeofenceGroup>(geofenceGroup);
            item.UserId = CurrentUser.Id;
            this.repository.Save(item);
            return Request.CreateResponse(
                HttpStatusCode.Created, Mapper.Map<GeofenceGroupModel>(item));
        }

        public HttpResponseMessage Put(GeofenceGroupModel geofenceGroup, int id)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            GeofenceGroup item = this.repository.GetById(id);
            if (item == null || item.User == null || item.User.Id != CurrentUser.Id)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            item.Name = geofenceGroup.Name;
            this.repository.Save(item);

            return Request.CreateResponse(
                HttpStatusCode.Accepted, Mapper.Map<GeofenceGroupModel>(item));
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