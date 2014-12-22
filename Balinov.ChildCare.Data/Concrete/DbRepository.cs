namespace Balinov.ChildCare.Data.Concrete
{
    using System.Collections.Generic;
    using System.Linq;
    using Balinov.ChildCare.Data.Abstract;

    internal class DbRepository<T> : BaseDbRepository<T>, IRepository<T>
        where T : BaseItem<T>
    {
        public IQueryable<T> GetAll()
        {
            return this.context.Items;
        }

        public T GetById(int id)
        {
            return this.context.Items.Find(id);
        }

        public void Save(T item)
        {
            if (item.Id == 0)
            {
                this.context.Items.Add(item);
            }

            this.context.SaveChanges();
        }

        public void Delete(T item)
        {
            this.context.Items.Remove(item);
            this.context.SaveChanges();
        }
    }
}
