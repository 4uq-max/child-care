namespace Balinov.ChildCare.Data.Concrete
{
    using System.Collections.Generic;
    using System.Linq;
    using Balinov.ChildCare.Data.Abstract;

    class DeviceInGeofenceDbRepository : BaseDbRepository<DeviceInGeofence>, ITwoKeyRepository<DeviceInGeofence>
    {
        public IQueryable<DeviceInGeofence> GetAll()
        {
            return this.context.Items;
        }

        public DeviceInGeofence GetByIds(int deviceId, int geofenceId)
        {
            // ToDo: Use Find
            return this.context.Items
                .FirstOrDefault(p => p.DeviceId == deviceId && p.GeofenceId == geofenceId);
        }

        public void Save(DeviceInGeofence item)
        {
            bool deviceExists = this.GetByIds(item.DeviceId, item.GeofenceId) != null;
            if (!deviceExists)
            {
                this.context.Items.Add(item);
            }

            this.context.SaveChanges();
        }

        public void Delete(DeviceInGeofence item)
        {
            this.context.Items.Remove(item);
            this.context.SaveChanges();
        }
    }
}
