/*namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;

    //[Table("BatteryStatuses")]
    public class BatteryStatus : DeviceItem<BatteryStatus>
    {
        [Required]
        [Range(0, 100)]
        public int Level { get; set; }

        [Required]
        public bool IsPlugged { get; set; }
    }
}*/