namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    using Microsoft.Practices.Unity;

    public abstract class BaseApiController : ApiController
    {
        private UserProfile currentUser;

        public UserProfile CurrentUser 
        {
            get
            {
                if (this.currentUser == null)
                {
                    this.currentUser = this.UserRepository.GetAll()
                        .FirstOrDefault(item => item.Email == User.Identity.Name);
                }

                return this.currentUser;
            }
        }

        [Dependency]
        public IRepository<UserProfile> UserRepository { get; set; }

        #region ResponceMessages

        [NonAction]
        protected HttpResponseMessage OkResult()
        {
            return this.OkResult<object>(new { Success = true });
        }

        [NonAction]
        protected HttpResponseMessage OkResult<T>(T item)
        {
            return Request.CreateResponse(HttpStatusCode.OK, item);
        }

        [NonAction]
        protected HttpResponseMessage ModelStateResult()
        {
            IEnumerable<string> modelStateErrors = ModelState.Values
                .Where(value => value.Errors.Count > 0)
                .Select(value => value.Errors.FirstOrDefault().ErrorMessage);
            return Request.CreateResponse(HttpStatusCode.BadRequest, modelStateErrors);
        }

        #endregion ResponceMessages
    }
}
