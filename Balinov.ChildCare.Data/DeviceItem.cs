namespace Balinov.ChildCare.Data
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Newtonsoft.Json;

    public abstract class DeviceItem : BaseItem
    {
        private int timestamp;

        /// <summary>
        /// Utc date.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Date 
        {
            get
            {
                return new DateTime(1970, 1, 1).AddSeconds(this.timestamp);
            }

            set
            {
                this.timestamp = (int)(value - new DateTime(1970, 1, 1)).TotalSeconds;
            }
        }

        [JsonIgnore]
        [NotMapped]
        public int TimeStamp
        {
            get 
            {
                return this.timestamp;
            }

            set
            {
                this.timestamp = value;
            }
        }

        [Required]
        [ForeignKey("Device")]
        public int DeviceId { get; set; }

        [JsonIgnore]
        public virtual Device Device { get; set; }
    }
}