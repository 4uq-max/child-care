namespace Balinov.ChildCare.Data
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public abstract class BaseItem<T> : IEquatable<T>
        where T: BaseItem<T>
    {
        [Key]
        [Required]
        public int Id { get; set; }

        public bool Equals(T other)
        {
            return this.Id == other.Id;
        }
    }
}