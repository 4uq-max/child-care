namespace Balinov.ChildCare.Data.Abstract
{
    using System.Collections.Generic;

    public interface IRepository<TEntity>
    {
        IEnumerable<TEntity> GetAll();

        TEntity GetById(int id);

        void Save(TEntity item);

        void Delete(TEntity item);
    }
}