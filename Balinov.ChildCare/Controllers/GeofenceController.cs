namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    using Balinov.ChildCare.ExtensionMethods;
    using Resources;

    public class GeofenceController : BaseApiController
    {
        private IRepository<Geofence> repository;

        public GeofenceController(IRepository<Geofence> repository)
        {
            this.repository = repository;
        }

        public IEnumerable<Geofence> Get()
        {
            IEnumerable<Geofence> geofences = this.repository.GetAll()
                .Where(item => item.User.Id == CurrentUser.Id);
            foreach (var geofence in geofences)
            {
                geofence.GeoJSON = geofence.Geography.ToGeoJSON();
                geofence.GeoJSONBuffered = geofence.Geography.Buffer(geofence.BufferRadius).ToGeoJSON();
            }

            return geofences;
        }

        public Geofence Get(int id)
        {
            Geofence geofence = this.repository.GetById(id);
            if (geofence.User.Id != CurrentUser.Id)
            {
                geofence = null;
            }

            return geofence;
        }

        [HttpPost]
        public HttpResponseMessage Post(Geofence geofence)
        {
            ModelState.Remove("geofence");
            ModelState.Remove("geofence.Geography");

            geofence.Geography = geofence.GeoJSON.ToDbGeography();
            if (geofence.Type == GeofenceType.None)
            {
                string errorMessage = string.Format(DataAnnotations.RequiredAttribute_ValidationError, DisplayResources.GeofenceType);
                ModelState.AddModelError("Type", errorMessage);
            }

            geofence.Geography = geofence.GeoJSON.ToDbGeography();
            if (geofence.Geography == null)
            {
                ModelState.AddModelError("Geography", DataAnnotations.ZoneGeographyRequired);
            }

            if (ModelState.ContainsKey("geofence.BufferRadius"))
            {
                var message = ModelState["geofence.BufferRadius"].Errors.Last().ErrorMessage;
                ModelState.AddModelError("BufferRadius", message);
                ModelState.Remove("geofence.BufferRadius");
            }

            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            geofence.UserId = CurrentUser.Id;
            this.repository.Save(geofence);

            geofence.GeoJSONBuffered = geofence.Geography.Buffer(geofence.BufferRadius).ToGeoJSON();
            return Request.CreateResponse(HttpStatusCode.Created, geofence);
        }

        public HttpResponseMessage Put(Geofence geofence, int id)
        {
            ModelState.Remove("geofence.Geography");
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            Geofence item = this.repository.GetById(id);
            if (item == null || item.User.Id != CurrentUser.Id)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            item.Name = geofence.Name;
            item.GroupId = geofence.GroupId;
            if (item.BufferRadius != geofence.BufferRadius)
            {
                item.BufferRadius = geofence.BufferRadius;
                item.GeoJSON = item.Geography.ToGeoJSON();
                item.GeoJSONBuffered = item.Geography.Buffer(item.BufferRadius).ToGeoJSON();
            }

            this.repository.Save(item);

            return Request.CreateResponse(HttpStatusCode.Accepted, item);
        }

        public HttpResponseMessage Delete(int id)
        {
            Geofence item = this.repository.GetById(id);
            if (item != null && item.User.Id == CurrentUser.Id)
            {
                if (item.Alarms.Count == 0)
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
