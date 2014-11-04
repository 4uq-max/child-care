/*namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("BatteryStatuses")]
    public class BatteryStatus : DeviceItem
    {
        [Required]
        [Range(0, 100)]
        public int Level { get; set; }

        [Required]
        public bool IsPlugged { get; set; }
    }
}*/