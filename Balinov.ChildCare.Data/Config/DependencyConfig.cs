namespace Balinov.ChildCare.Data.Config
{
    using Balinov.ChildCare.Data.Abstract;
    using Balinov.ChildCare.Data.Concrete;
    using Microsoft.Practices.Unity;

    public class DependencyConfig
    {
        public static void RegisterTypes(UnityContainer container)
        {
            container.RegisterType<IRepository<Activity>, DbRepository<Activity>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<Alarm>, DbRepository<Alarm>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<Device>, DbRepository<Device>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<Geofence>, DbRepository<Geofence>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<GeofenceGroup>, DbRepository<GeofenceGroup>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<Notification>, DbRepository<Notification>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<Position>, DbRepository<Position>>(new HierarchicalLifetimeManager());
            container.RegisterType<IRepository<UserProfile>, DbRepository<UserProfile>>(new HierarchicalLifetimeManager());

            container.RegisterType<ITwoKeyRepository<UserDevice>, UserDeviceDbRepository>(new HierarchicalLifetimeManager());
            container.RegisterType<ITwoKeyRepository<DeviceInGeofence>, DeviceInGeofenceDbRepository>(new HierarchicalLifetimeManager());
        }
    }
}