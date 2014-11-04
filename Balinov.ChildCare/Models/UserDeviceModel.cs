namespace Balinov.ChildCare.Models
{
    using System.ComponentModel.DataAnnotations;
    using Resources;

    public class UserDeviceModel
    {
        [Required(AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 3)]
        [Display(Name = "Name", ResourceType = typeof(DisplayResources))]
        public virtual string Name { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 3)]
        [Display(Name = "Platform", ResourceType = typeof(DisplayResources))]
        public virtual string Platform { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50)]
        [Display(Name = "Uuid", ResourceType = typeof(DisplayResources))]
        public virtual string Uuid { get; set; }
    }
}