namespace Balinov.ChildCare.Data
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Resources;

    [Table("Users")]
    public class UserProfile : BaseItem<UserProfile>
    {
        [Required]
        [MaxLength(100)]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email", ResourceType = typeof(DisplayResources))]
        public string Email { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(80)]
        [Display(Name = "FirstName", ResourceType = typeof(DisplayResources))]
        public string FirstName { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(80)]
        [Display(Name = "LastName", ResourceType = typeof(DisplayResources))]
        public string LastName { get; set; }
    }
}