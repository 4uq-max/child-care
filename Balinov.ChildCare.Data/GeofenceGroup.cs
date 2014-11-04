namespace Balinov.ChildCare.Data
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Newtonsoft.Json;
    using Resources;

    [Table("GeofenceGroups")]
    public class GeofenceGroup : BaseItem
    {
        public GeofenceGroup()
        {
            this.Geofences = new HashSet<Geofence>();
        }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        [Display(Name = "Name", ResourceType = typeof(DisplayResources))]
        public string Name { get; set; }

        [StringLength(100)]
        public string Image { get; set; }

        [JsonIgnore]
        [ForeignKey("User")]
        public int? UserId { get; set; }

        [JsonIgnore]
        public virtual UserProfile User { get; set; }

        public bool? IsUserItem 
        {
            get
            {
                return this.UserId.HasValue; 
            }
        }

        [JsonIgnore]
        public virtual ICollection<Geofence> Geofences { get; set; }
    }
}