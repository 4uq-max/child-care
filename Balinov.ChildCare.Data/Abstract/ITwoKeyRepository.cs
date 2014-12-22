namespace Balinov.ChildCare.Data.Abstract
{
    using System.Collections.Generic;
    using System.Linq;

    public interface ITwoKeyRepository<TEntity>
    {
        IQueryable<TEntity> GetAll();

        TEntity GetByIds(int key1, int key2);

        void Save(TEntity item);

        void Delete(TEntity item);
    }
}
