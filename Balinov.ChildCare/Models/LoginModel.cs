namespace Balinov.ChildCare.Models
{
    using System.ComponentModel.DataAnnotations;
    using Resources;

    public class LoginModel
    {
        [Required]
        [Display(Name = "Email", ResourceType = typeof(DisplayResources))]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password", ResourceType = typeof(DisplayResources))]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}