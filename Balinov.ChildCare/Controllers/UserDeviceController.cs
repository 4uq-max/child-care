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
    using Balinov.ChildCare.Models;
    using Microsoft.Practices.Unity;
    using Resources;

    public class UserDeviceController : BaseApiController
    {
        private ITwoKeyRepository<UserDevice> repository;

        public UserDeviceController(ITwoKeyRepository<UserDevice> repository)
        {
            this.repository = repository;
        }

        [Dependency]
        public IRepository<Activity> ActivityRepository { get; set; }

        [Dependency]
        public IRepository<Device> DeviceReposiotry { get; set; }
        
        [Dependency]
        public IRepository<Position> PositionRepository { get; set; }

        public IEnumerable<object> Get()
        {
            return this.repository.GetAll()
                .Where(item => item.User.Id == CurrentUser.Id)
                .Select(item => new
                {
                    item.UserId,
                    item.DeviceId,
                    item.ApprovalStatus,
                    Name = item.Device.Name
                });
        }

        public HttpResponseMessage Post(UserDeviceModel device)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }
            
            Device item = this.DeviceReposiotry.GetAll()
                .FirstOrDefault(d => d.Name == device.Name &&
                        d.Platform == device.Platform &&
                        d.Uuid == device.Uuid);
            
            if (item == null)
            {
                ModelState.AddModelError("DeviceNotFound", DataAnnotations.DeviceNotFound);
                return this.ModelStateResult();
            }

            bool deviceExists = this.repository.GetByIds(CurrentUser.Id, item.Id) != null;
            if (deviceExists)
            {
                ModelState.AddModelError("DeviceExists", DataAnnotations.DeviceExists);
                return this.ModelStateResult();
            }

            UserDevice userDevice = new UserDevice()
            {
                DeviceId = item.Id,
                UserId = CurrentUser.Id,
                ApprovalStatus = ApprovalStatus.Pending
            };

            this.repository.Save(userDevice);
            return Request.CreateResponse(
                HttpStatusCode.Created,
                new
                {
                    userDevice.UserId,
                    userDevice.DeviceId,
                    userDevice.ApprovalStatus,
                    Name = item.Name
                });
        }

        public HttpResponseMessage Delete(int deviceId)
        {
            UserDevice item = this.repository.GetByIds(CurrentUser.Id, deviceId);
            if (item != null)
            {
                this.repository.Delete(item);
                return this.OkResult();
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        public object GetHistory(int id, int timestamp)
        {
            DateTime unixDate = new DateTime(1970, 1, 1);
            DateTime dateFrom = unixDate.AddDays(1).AddSeconds(timestamp).Date;
            DateTime dateTo = dateFrom.AddDays(1);

            var positions = this.PositionRepository.GetAll()
                .Where(item => item.Date >= dateFrom && item.Date <= dateTo)
                .OrderBy(item => item.Date).ToList();
            
            if (!positions.Any())
            {
                ModelState.AddModelError("PositionsNotFound", DataAnnotations.DataNotFound);
                return this.ModelStateResult();
            }
            
            var activities = this.ActivityRepository.GetAll()
                .Where(item => item.Date >= dateFrom && item.Date < dateTo)
                .OrderBy(item => item.Date).ToList();

            positions.ForEach(item => { item.Date = item.Date.ToLocalTime(); });
            activities.ForEach(item => { item.Date = item.Date.ToLocalTime(); });

            return new
            {
                Extent = this.GetBounds(positions),
                Positions = positions.Select(item => new
                {
                    TimeStamp = item.TimeStamp,
                    item.Longitude,
                    item.Latitude
                }),
                Activities = activities.Select(item => new
                {
                    item.TimeStamp,
                    Type = item.Type.ToString(),
                    item.Confidence
                })
            };
        }

        [Route("api/userdevice/getplatforms")]
        public IEnumerable<string> GetPlatforms()
        {
            return this.DeviceReposiotry.GetAll()
                .Select(item => item.Platform)
                .Distinct();
        }

        [Route("api/userdevice/getpendingrequests")]
        public IEnumerable<object> GetPendingRequests(int deviceId) 
        {
            return this.repository.GetAll()
                .Where(item => item.DeviceId == deviceId &&
                    item.ApprovalStatus == ApprovalStatus.Pending)
                .Select(item => item.User);
        }

        [HttpPost]
        [Route("api/userdevice/changestatus/")]
        public object ChangeStatus(UserDeviceDTO userDevice)
        {
            UserDevice device = this.repository.GetByIds(userDevice.UserId, userDevice.DeviceId);
            if (device != null && device.ApprovalStatus == ApprovalStatus.Pending) 
            {
                device.ApprovalStatus = userDevice.Status;
                this.repository.Save(device);
                return new { Success = true };
            }

            return new { Success = false };
        }

        private IEnumerable<double> GetBounds(IEnumerable<Position> positions)
        {
            double minX, minY, maxX, maxY;
            var firstPoition = positions.FirstOrDefault();
            minX = maxX = firstPoition.Longitude;
            minY = maxY = firstPoition.Latitude;

            foreach (var position in positions)
            {
                if (position.Longitude < minX)
                {
                    minX = position.Longitude;
                }

                if (position.Longitude > maxX)
                {
                    maxX = position.Longitude;
                }

                if (position.Latitude < minY)
                {
                    minY = position.Latitude;
                }

                if (position.Latitude > maxY)
                {
                    maxY = position.Latitude;
                }
            }

            return new double[] { minX, minY, maxX, maxY };
        }

        public class UserDeviceDTO
        {
            public int DeviceId { get; set; }

            public int UserId { get; set; }

            public ApprovalStatus Status { get; set; }
        }
    }
}
