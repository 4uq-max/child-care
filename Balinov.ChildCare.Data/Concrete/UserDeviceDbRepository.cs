namespace Balinov.ChildCare.Data.Concrete
{
    using System.Linq;
    using System.Collections.Generic;
    using Balinov.ChildCare.Data.Abstract;

    internal class UserDeviceDbRepository : BaseDbRepository<UserDevice>, ITwoKeyRepository<UserDevice>
    {
        public IQueryable<UserDevice> GetAll()
        {
            return this.context.Items;
        }

        public UserDevice GetByIds(int userId, int deviceId)
        {
            return this.context.Items
                .FirstOrDefault(p => p.UserId == userId && p.DeviceId == deviceId);
        }

        public void Save(UserDevice item)
        {
            bool deviceExists = this.GetByIds(item.UserId, item.DeviceId) != null;
            if (!deviceExists)
            {
                this.context.Items.Add(item);
            }

            this.context.SaveChanges();
        }

        public void Delete(UserDevice item)
        {
            this.context.Items.Remove(item);
            this.context.SaveChanges();
        }
    }
}
