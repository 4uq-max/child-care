namespace Balinov.ChildCare.Data.Concrete
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    internal class BaseDbRepository<T> : IDisposable
        where T : class
    {
        private bool disposed = false;

        protected DataContext<T> context = new DataContext<T>();

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (this.context != null)
                    {
                        this.context.Dispose();
                        this.context = null;
                    }
                }
            }

            this.disposed = true;
        }
    }
}
