namespace Balinov.ChildCare.Data
{   
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Newtonsoft.Json;

    [Table("Devices")]
    public class Device : BaseItem<Device>
    {
        public Device() : base()
        {
            this.Activities = new HashSet<Activity>();
            this.Positions = new HashSet<Position>();
        }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Platform { get; set; }

        [Required]
        [MaxLength(50)]
        public string Model { get; set; }

        [Required]
        [MaxLength(50)]
        public string Version { get; set; }

        [Required]
        [MaxLength(50)]
        public string Uuid { get; set; }

        // [JsonIgnore]
        // public virtual ICollection<Acceleration> Accelerations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Activity> Activities { get; set; }

        // [JsonIgnore]
        // public virtual ICollection<BatteryStatus> BatteryStatuses { get; set; }

        // [JsonIgnore]
        // public virtual ICollection<CompassHeading> CompassHeadings { get; set; }

        // [JsonIgnore]
        // public virtual ICollection<GyroscopeOrientation> GyroscopeOrientations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Position> Positions { get; set; }
    }
}