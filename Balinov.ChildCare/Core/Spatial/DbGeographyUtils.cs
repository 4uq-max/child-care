namespace Balinov.ChildCare.Core.Spatial
{
    using System.Collections.Generic;
    using System.Data.Entity.Spatial;

    public class DbGeographyUtils
    {
        public static DbGeography Union(List<DbGeography> geographies)
        {
            if (geographies.Count == 0)
            {
                return null;
            }

            if (geographies.Count == 1)
            {
                return geographies[0];
            }

            return FastUnion(geographies)[0];
        }

        private static List<DbGeography> FastUnion(List<DbGeography> sourceGeographies)
        {
            List<DbGeography> resultGeographies = new List<DbGeography>();

            int count = sourceGeographies.Count;
            if (count % 2 == 1)
            {
                count--;
                resultGeographies.Add(sourceGeographies[count]);
            }

            for (int i = 0; i < count; i += 2)
            {
                DbGeography union = sourceGeographies[i].Union(sourceGeographies[i + 1]);
                resultGeographies.Add(union);
            }

            if (resultGeographies.Count > 1)
            {
                resultGeographies = FastUnion(resultGeographies);
            }

            return resultGeographies;
        }
    }
}