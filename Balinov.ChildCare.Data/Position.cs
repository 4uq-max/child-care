namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Positions")]
    public class Position : DeviceItem
    {
        [Required]
        public double Longitude { get; set; }

        [Required]
        public double Latitude { get; set; }

        public double? Altitude { get; set; }

        public double? Accuracy { get; set; }

        public double? AltitudeAccuracy { get; set; }

        public double? Heading { get; set; }

        public double? Speed { get; set; }

        public byte? Source { get; set; }

        public PositionSource? NumberOfSattelites { get; set; }

        public double? HDOP { get; set; }

        public double? VDOP { get; set; }
    }
}