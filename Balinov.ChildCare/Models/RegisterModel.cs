namespace Balinov.ChildCare.Models
{
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using Resources;

    public class RegisterModel
    {
        [Required(AllowEmptyStrings = false)]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email", ResourceType = typeof(DisplayResources))]
        public string Email { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(100, MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password", ResourceType = typeof(DisplayResources))]
        public string Password { get; set; }

        [Required(AllowEmptyStrings = false)]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessageResourceName = "ConfirmPasswordError", ErrorMessageResourceType = typeof(DisplayResources))]
        [Display(Name = "ConfirmPassword", ResourceType = typeof(DisplayResources))]
        public string ConfirmPassword { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "FirstName", ResourceType = typeof(DisplayResources))]
        public string FirstName { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "LastName", ResourceType = typeof(DisplayResources))]
        public string LastName { get; set; }
    }
}