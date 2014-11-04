namespace Balinov.ChildCare.Controllers
{
    using System.Linq;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Security;
    using Balinov.ChildCare.Models;
    using Resources;
    using WebMatrix.WebData;

    [Authorize]
    public class AccountController : BaseApiController
    {
        [AllowAnonymous]
        public object GetInfo()
        {
            return new
            {
                IsAuthenticated = User.Identity.IsAuthenticated
            };
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/register")]
        public HttpResponseMessage Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                    object propertyValues = new
                    {
                        FirstName = model.FirstName,
                        LastName = model.LastName
                    };
                    WebSecurity.CreateUserAndAccount(model.Email, model.Password, propertyValues);
                    return this.OkResult();
                }
                catch (MembershipCreateUserException ex)
                {
                    ModelState.AddModelError(ex.StatusCode.ToString(), ErrorCodeToString(ex.StatusCode));
                }
            }

            return this.ModelStateResult();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/login")]
        public HttpResponseMessage Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                if (WebSecurity.Login(model.Email, model.Password, persistCookie: model.RememberMe))
                {
                    FormsAuthentication.SetAuthCookie(model.Email, model.RememberMe);

                    var user = this.UserRepository.GetAll()
                        .FirstOrDefault(item => item.Email == model.Email);
                    int userId = (user != null) ? user.Id : 0;

                    return this.OkResult<object>(new { Success = true, UserId = userId });
                }
                else
                {
                    ModelState.AddModelError("InvalidEmailOrPassword", MembershipResources.InvalidEmailOrPassword);
                }
            }

            return this.ModelStateResult();
        }

        [HttpPost]
        [Route("api/account/logout")]
        public object Logout()
        {
            if (User.Identity.IsAuthenticated)
            {
                WebSecurity.Logout();
                return true;
            }

            return false;
        }

        #region Helpers

        [NonAction]
        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            var culture = System.Globalization.CultureInfo.CurrentCulture;
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                case MembershipCreateStatus.DuplicateEmail:
                case MembershipCreateStatus.InvalidPassword:
                case MembershipCreateStatus.InvalidEmail:
                case MembershipCreateStatus.InvalidAnswer:
                case MembershipCreateStatus.InvalidQuestion:
                case MembershipCreateStatus.InvalidUserName:
                case MembershipCreateStatus.ProviderError:
                case MembershipCreateStatus.UserRejected:
                    return MembershipResources.ResourceManager.GetString(createStatus.ToString(), culture);
                default:
                    return MembershipResources.UnknownError;
            }
        }

        #endregion
    }
}
