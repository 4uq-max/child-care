namespace Balinov.ChildCare.Data
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class GeofenceGroup : BaseItem<GeofenceGroup>
    {
        public GeofenceGroup()
        {
            this.Geofences = new HashSet<Geofence>();
        }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Image { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }

        public virtual UserProfile User { get; set; }

        public virtual ICollection<Geofence> Geofences { get; set; }
    }
}