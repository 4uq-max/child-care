namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Balinov.ChildCare.Data;
    using Newtonsoft.Json;    
    using Resources;

    [Table("DevicesInGeofences")]
    public class DeviceInGeofence
    {
        [Required]
        [Column(Order = 1), Key, ForeignKey("Geofence")]
        [Display(Name = "Geofence", ResourceType = typeof(DisplayResources))]
        public int GeofenceId { get; set; }

        [JsonIgnore]
        public virtual Geofence Geofence { get; set; }

        [Required]
        [Column(Order = 0), Key, ForeignKey("Device")]
        [Display(Name = "Device", ResourceType = typeof(DisplayResources))]
        public int DeviceId { get; set; }

        [JsonIgnore]
        public virtual Device Device { get; set; }

        [Required]
        public bool IsInGeofence { get; set; }
    }
}