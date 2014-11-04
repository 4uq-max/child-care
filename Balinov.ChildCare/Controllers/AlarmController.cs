namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    using Microsoft.Practices.Unity;
    using Resources;
    
    public class AlarmController : BaseApiController
    {
        private IRepository<Alarm> repository;

        public AlarmController(IRepository<Alarm> repository)
        {
            this.repository = repository;
        }

        [Dependency]
        public IRepository<Geofence> GeofenceRepository { get; set; }

        [Dependency]
        public IRepository<Device> DeviceRepository { get; set; }

        public IEnumerable<AlarmDTO> Get()
        {
            return this.repository.GetAll()
                .Where(item => item.Geofence.UserId == CurrentUser.Id)
                .Select(item => new AlarmDTO()
                {
                    Id = item.Id,
                    GeofenceId = item.GeofenceId,
                    GeofenceName = item.Geofence.Name,
                    DeviceId = item.DeviceId,
                    DeviceName = item.Device.Name
                });
        }

        public HttpResponseMessage Post(Alarm alarm)
        {
            this.VlidateAlarm(alarm);

            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            bool alarmExists = this.repository.GetAll()
                .Any(item => item.DeviceId == alarm.DeviceId &&
                        item.GeofenceId == alarm.GeofenceId);

            if (alarmExists)
            {
                ModelState.AddModelError("AlarmExists", DataAnnotations.AlarmExists);
                return this.ModelStateResult();
            }

            this.repository.Save(alarm);
            alarm.Geofence = this.GeofenceRepository.GetById(alarm.GeofenceId);
            alarm.Device = this.DeviceRepository.GetById(alarm.DeviceId);

            return Request.CreateResponse(HttpStatusCode.Created, new AlarmDTO(alarm));
        }

        public HttpResponseMessage Put(Alarm alarm, int id)
        {
            this.VlidateAlarm(alarm);
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            Alarm item = this.repository.GetById(id);
            if (item == null || 
                this.GeofenceRepository.GetById(item.GeofenceId).UserId != CurrentUser.Id)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
                
            item.GeofenceId = alarm.GeofenceId;
            item.DeviceId = alarm.DeviceId;
            this.repository.Save(item);

            return Request.CreateResponse(HttpStatusCode.Accepted, new AlarmDTO(item));
        }

        public HttpResponseMessage Delete(int id)
        {
            Alarm item = this.repository.GetById(id);
            if (item != null && item.Geofence.UserId == CurrentUser.Id)
            {
                this.repository.Delete(item);
                return this.OkResult();
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        private void VlidateAlarm(Alarm alarm)
        {
            if (alarm.GeofenceId == 0)
            {
                ModelState.AddModelError(
                    "alarm.GeofenceId",
                    string.Format(DataAnnotations.RequiredAttribute_ValidationError, DisplayResources.Geofence));
            }

            if (alarm.DeviceId == 0)
            {
                ModelState.AddModelError(
                    "alarm.DeviceId",
                    string.Format(DataAnnotations.RequiredAttribute_ValidationError, DisplayResources.Device));
            }

            ModelState.Remove("alarm");
        }

        public class AlarmDTO
        {
            public AlarmDTO()
            {
            }

            public AlarmDTO(Alarm alarm)
            {
                this.Id = alarm.Id;
                this.GeofenceId = alarm.GeofenceId;
                this.GeofenceName = alarm.Geofence.Name;
                this.DeviceId = alarm.DeviceId;
                this.DeviceName = alarm.Device.Name;
            }

            public int Id { get; set; }

            public int GeofenceId { get; set; }

            public string GeofenceName { get; set; }

            public int DeviceId { get; set; }

            public string DeviceName { get; set; }
        }
    }
}
