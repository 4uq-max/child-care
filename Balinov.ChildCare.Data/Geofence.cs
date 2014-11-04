namespace Balinov.ChildCare.Data
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Resources;
    
    [Table("Geofences")]
    public class Geofence : BaseItem
    {
        public Geofence()
        {
            this.Alarms = new HashSet<Alarm>();
        }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 3)]
        [Display(Name = "Name", ResourceType = typeof(DisplayResources))]
        public string Name { get; set; }

        [Required]
        [ForeignKey("Group")]
        [Range(1, double.MaxValue, ErrorMessageResourceName = "RequiredAttribute_ValidationError",
            ErrorMessageResourceType = typeof(DataAnnotations))]
        [Display(Name = "Group", ResourceType = typeof(DisplayResources))]
        public int GroupId { get; set; }

        [JsonIgnore]
        public virtual GeofenceGroup Group { get; set; }

        [Required]
        [Display(Name = "GeofenceType", ResourceType = typeof(DisplayResources))]
        public GeofenceType Type { get; set; }

        [Required]
        [JsonIgnore]
        public virtual DbGeography Geography { get; set; }

        [NotMapped]
        public virtual JObject GeoJSON { get; set; }

        [NotMapped]
        public virtual JObject GeoJSONBuffered { get; set; }

        [Range(1, 100)]
        [Display(Name = "BufferRadius", ResourceType = typeof(DisplayResources))]
        public double BufferRadius { get; set; }

        [Required]
        [JsonIgnore]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public virtual UserProfile User { get; set; }

        [JsonIgnore]
        public virtual ICollection<Alarm> Alarms { get; set; }
    }
}