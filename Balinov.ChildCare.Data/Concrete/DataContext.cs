namespace Balinov.ChildCare.Data.Concrete
{
    using System.Data.Entity;

    internal class DataContext<T> : DbContext
        where T : class
    {
        public DataContext()
            : base("name=ChildCareDb")
        {
        }

        public IDbSet<T> Items { get; set; }
    }
}
