namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;

    public class Activity : DeviceItem<Activity>
    {
        [Required]
        public ActivityType Type { get; set; }

        [Required]
        [Range(0, 100)]
        public int Confidence { get; set; }
    }
}