namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Activities")]
    public class Activity : DeviceItem
    {
        [Required]
        public ActivityType Type { get; set; }

        [Required]
        [Range(0, 100)]
        public int Confidence { get; set; }
    }
}