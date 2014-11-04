namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Balinov.ChildCare.Data;
    using Newtonsoft.Json;

    [Table("UserDevices")]
    public class UserDevice
    {
        [Required]
        [Column(Order = 0), Key, ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public virtual UserProfile User { get; set; }

        [Required]
        [Column(Order = 1), Key, ForeignKey("Device")]
        public int DeviceId { get; set; }

        [JsonIgnore]
        public virtual Device Device { get; set; }

        [Required]
        public ApprovalStatus ApprovalStatus { get; set; }
    }
}