namespace Balinov.ChildCare.Models
{
    using System.ComponentModel.DataAnnotations;

    public abstract class BaseModel
    {
        [Required]
        public int Id { get; set; }
    }
}