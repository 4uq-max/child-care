namespace Balinov.ChildCare.Data.Abstract
{
    using System.Linq;
    using System.Collections.Generic;

    public interface IRepository<TEntity>
    {
        IQueryable<TEntity> GetAll();

        TEntity GetById(int id);

        void Save(TEntity item);

        void Delete(TEntity item);
    }
}