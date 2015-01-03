namespace Balinov.ChildCare
{
    using System.Web.Http;
    using Balinov.ChildCare.Data.Config;
    using Microsoft.Practices.Unity;
    
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var container = new UnityContainer();
            DependencyConfig.RegisterTypes(container);
            config.DependencyResolver = new UnityDependencyResolver(container);

            config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
            
            // Web API configuration and services
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });

            //config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
        }
    }
}
