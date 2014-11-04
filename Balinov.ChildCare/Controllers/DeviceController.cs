namespace Balinov.ChildCare.Controllers
{
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;

    public class DeviceController : BaseApiController
    {
        private IRepository<Device> repository;

        public DeviceController(IRepository<Device> repository)
        {
            this.repository = repository;
        }

        public Device Get(
            string uuid, string platform, string name, string model, string version) 
        {
            Device result = this.repository.GetAll()
                .FirstOrDefault(item => item.Uuid == uuid &&
                    item.Platform == platform);

            if (result != null)
            {
                if (result.Name != name)
                {
                    result.Name = name;
                }

                if (result.Model != model)
                {
                    result.Model = model;
                }

                if (result.Version != version)
                {
                    result.Version = version;
                }

                this.repository.Save(result);
            }

            return result;
        }

        [HttpPost]
        public HttpResponseMessage Post(Device device)
        {
            if (!ModelState.IsValid)
            {
                return this.ModelStateResult();
            }

            bool deviceExists = this.repository.GetAll()
                .Any(item => item.Uuid == device.Uuid &&
                    item.Platform == device.Platform);

            if (deviceExists)
            {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
            else
            {
                this.repository.Save(device);
            }
           
            return Request.CreateResponse(HttpStatusCode.Created, device);
        }
    }
}
