namespace Balinov.ChildCare.Data
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public abstract class BaseItem : IEquatable<BaseItem>
    {
        [Key]
        [Required]
        public int Id { get; set; }

        public bool Equals(BaseItem other)
        {
            return this.Id == other.Id;
        }
    }
}