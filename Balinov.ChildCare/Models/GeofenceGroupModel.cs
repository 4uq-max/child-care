namespace Balinov.ChildCare.Models
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using Balinov.ChildCare.Data;
    using Balinov.ChildCare.Infrastructure.Mapping;
    using Resources;

    public class GeofenceGroupModel : BaseModel, IMapWith<GeofenceGroup>, IHaveCustomMappings
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        [Display(Name = "Name", ResourceType = typeof(DisplayResources))]
        public string Name { get; set; }

        [StringLength(100)]
        public string Image { get; set; }

        public bool IsUserItem { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<GeofenceGroup, GeofenceGroupModel>()
                .ForMember(dest => dest.IsUserItem, a => a.MapFrom(src => src.UserId.HasValue));
        }
    }
}