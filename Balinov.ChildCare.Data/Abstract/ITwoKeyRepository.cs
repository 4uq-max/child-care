namespace Balinov.ChildCare.Data.Abstract
{
    using System.Collections.Generic;

    public interface ITwoKeyRepository<TEntity>
    {
        IEnumerable<TEntity> GetAll();

        TEntity GetByIds(int key1, int key2);

        void Save(TEntity item);

        void Delete(TEntity item);
    }
}
