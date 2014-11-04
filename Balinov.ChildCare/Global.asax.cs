namespace Balinov.ChildCare
{
    using System.ComponentModel.DataAnnotations;
    using System.Reflection;
    using System.Web;
    using System.Web.Http;

    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            this.GlobalizeResources();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AuthConfig.RegisterAuth();
        }

        private void GlobalizeResources() 
        {
            var resourceType = typeof(RequiredAttribute).Assembly
                .GetType("System.ComponentModel.DataAnnotations.Resources.DataAnnotationsResources");
            resourceType.GetField("resourceMan", BindingFlags.Static | BindingFlags.NonPublic)
                .SetValue(null, Resources.DataAnnotations.ResourceManager);
        }
    }
}
