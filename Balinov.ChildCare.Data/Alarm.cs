namespace Balinov.ChildCare.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Newtonsoft.Json;
    using Resources;

    [Table("Alarms")]
    public class Alarm : BaseItem, IValidatableObject
    {
        [Required]
        [ForeignKey("Geofence")]
        [Display(Name = "Geofence", ResourceType = typeof(DisplayResources))]
        public int GeofenceId { get; set; }

        [JsonIgnore]
        public virtual Geofence Geofence { get; set; }

        [Required]
        [ForeignKey("Device")]
        [Display(Name = "Device", ResourceType = typeof(DisplayResources))]
        public int DeviceId { get; set; }

        [JsonIgnore]
        public virtual Device Device { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (this.GeofenceId == 0)
            {
                yield return new ValidationResult(
                    string.Format(DataAnnotations.RequiredAttribute_ValidationError, DisplayResources.Geofence),
                    new [] { "GeofenceId" });
            }

            if (this.DeviceId == 0)
            {
                yield return new ValidationResult(
                    string.Format(DataAnnotations.RequiredAttribute_ValidationError, DisplayResources.Device),
                    new [] { "DeviceId" });
            }
        }
    }
}