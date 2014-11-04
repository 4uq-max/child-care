namespace Balinov.ChildCare.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Spatial;
    using System.Linq;
    using System.Web.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    using Microsoft.Practices.Unity;

    public class PositionController : BaseApiController
    {
        private IRepository<Position> repository;

        public PositionController(IRepository<Position> repository)
        {
            this.repository = repository;
        }

        [Dependency]
        public IRepository<Notification> NotificationRepository { get; set; }
        
        [Dependency]
        public IRepository<Alarm> AlarmRepository { get; set; }
        
        [Dependency]
        public ITwoKeyRepository<UserDevice> UserDeviceRepository { get; set; }
        
        [Dependency]
        public ITwoKeyRepository<DeviceInGeofence> DevicesInGeofencesRepository { get; set; }

        public object Post(IEnumerable<Position> positions)
        {
            if (positions == null || !positions.Any())
            {
                return new { Success = false };
            }

            this.CheckForNotifications(positions);
            foreach (var position in positions)
            {
                this.repository.Save(position);
            }

            return new { Success = true };
        }

        private void CheckForNotifications(IEnumerable<Position> positions)
        {
            int deviceId = positions.FirstOrDefault().DeviceId;
            var geofences = this.AlarmRepository.GetAll()
                .Where(item => item.DeviceId == deviceId)
                .Select(item => item.Geofence);
            
            foreach (var geofence in geofences)
            {
                DeviceInGeofence deviceInGeofence = this.GetDeviceInGeofence(deviceId, geofence.Id);
                foreach (var position in positions)
                {
                    bool positionInGeofence = this.GeofenceContainsPosition(geofence, position);
                    if (deviceInGeofence.IsInGeofence != positionInGeofence)
                    {
                        deviceInGeofence.IsInGeofence = positionInGeofence;
                        var userDevices = this.UserDeviceRepository.GetAll()
                            .Where(item => item.DeviceId == deviceId &&
                                item.ApprovalStatus == ApprovalStatus.Approved);
                        foreach (var userDevice in userDevices)
                        {
                            var notification = new Notification()
                            {
                                Date = DateTime.Now,
                                UserId = userDevice.UserId,
                                Message = string.Format(
                                    positionInGeofence ? "Устройство {0} влезе в зона {1}" :
                                        "Устройство {0} излезе от зона {1}",
                                    userDevice.Device.Name,
                                    geofence.Name)
                            };
                            this.NotificationRepository.Save(notification);
                        }
                    }
                }
            }
        }

        private bool GeofenceContainsPosition(Geofence geofence, Position position)
        {
            var geofenceGeography = geofence.Geography.Buffer(geofence.BufferRadius);
            var culture = System.Globalization.CultureInfo.InvariantCulture;
            string text = "POINT(" + position.Longitude.ToString(culture) + " " +
                position.Latitude.ToString(culture) + ")";
            var pointGeography = DbGeography.FromText(text, 4326);
            return !geofenceGeography.Disjoint(pointGeography);
        }

        private DeviceInGeofence GetDeviceInGeofence(int deviceId, int geofenceId)
        {
            DeviceInGeofence result = this.DevicesInGeofencesRepository
                .GetByIds(deviceId, geofenceId);

            if (result == null)
            {
                result = new DeviceInGeofence() 
                {
                    DeviceId = deviceId,
                    GeofenceId = geofenceId,
                    IsInGeofence = false
                };

                this.DevicesInGeofencesRepository.Save(result);
            }

            return result;
        }
    }
}
