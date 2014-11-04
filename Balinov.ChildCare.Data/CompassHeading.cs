/*namespace Balinov.ChildCare.Data
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("CompassHeadings")]
    public class CompassHeading : DeviceItem
    {
        [Required]
        [Range(0, 360d)]
        public double MagneticHeading { get; set; }

        [Required]
        [Range(0, 360d)]
        public double TrueHeading { get; set; }

        [Required]
        public double Accuracy { get; set; }
    }
}*/