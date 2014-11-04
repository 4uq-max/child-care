namespace Balinov.ChildCare.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Data.Abstract;
    
    public class ActivityController : BaseApiController
    {
        private IRepository<Activity> repository;

        public ActivityController(IRepository<Activity> repository)
        {
            this.repository = repository;
        }

        public object Post(IEnumerable<Activity> activities)
        {
            if (activities == null || !activities.Any())
            {
                return new { Success = false };
            }

            foreach (var activity in activities)
            {
                this.repository.Save(activity);
            }

            return new { Success = true };
        }
    }
}
