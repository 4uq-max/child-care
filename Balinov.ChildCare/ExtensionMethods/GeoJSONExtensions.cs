namespace Balinov.ChildCare.ExtensionMethods
{
    using System.Collections.Generic;
    using System.Data.Entity.Spatial;
    using System.Globalization;
    using System.Text;
    using Balinov.ChildCare.Core.Spatial;
    using Newtonsoft.Json.Linq;
    
    public static class GeoJSONExtensions
    {
        private static CultureInfo culture = CultureInfo.InvariantCulture;

        public static JObject ToGeoJSON(this DbGeography geography)
        {
            JObject result = null;
            switch (geography.SpatialTypeName)
            {
                case "Point":
                    result = GetGeoJSONPointFromDbGeography(geography);
                    break;
                case "LineString":
                case "MultiPoint":
                    result = GetGeoJSONLineStringOrMultiPointFromDbGeography(geography);
                    break;
                case "Polygon":
                    result = GetGeoJSONPolygonFromDbGeography(geography);
                    break;
                case "MultiLineString":
                    result = GetGeoJSONMultiLineStringFromDbGeography(geography);
                    break;
                case "MultiPolygon":
                    result = GetGeoJSONMultiPolygonFromDbGeography(geography);
                    break;
                case "GeometryCollection":
                    result = GetGeoJSONGeometryCollectionFromDbGeography(geography);
                    break;
                default:
                    break;
            }

            return result;
        }

        public static DbGeography ToDbGeography(this JObject geoJSON)
        {
            List<DbGeography> geographies = new List<DbGeography>();

            var geometryCollection = geoJSON.SelectToken("geometries");
            foreach (JToken geometry in geometryCollection)
            {
                DbGeography geography = null;
                string geometryType = geometry.SelectToken("type").Value<string>();
                switch (geometryType)
                {
                    case "Point":
                        geography = GetDbGeographyFromPoint(geometry);
                        break;
                    case "LineString":
                        geography = GetDbGeographyFromLineString(geometry);
                        break;
                    case "Polygon":
                        geography = GetDbGeographyFromPolygon(geometry);
                        break;
                    default:
                        break;
                }

                if (geography != null)
                {
                    geographies.Add(geography);
                }
            }

            return DbGeographyUtils.Union(geographies);
        }

        #region To GeoJSON
        
        private static JObject GetGeoJSONGeometryCollectionFromDbGeography(DbGeography geography)
        {
            JArray geometries = new JArray();
            for (int i = 1; i <= geography.ElementCount; i++)
            {
                var geometry = geography.ElementAt(i);
                geometries.Add(geography.ToGeoJSON());
            }

            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            result.Add("geometries", geometries);
            return result;
        }

        private static JObject GetGeoJSONMultiPolygonFromDbGeography(DbGeography geography)
        {
            JArray coordinates = new JArray();
            for (int i = 1; i <= geography.ElementCount; i++)
            {
                JArray polygonJs = new JArray();
                var polygon = geography.ElementAt(i);
                for (int j = 1; j <= polygon.ElementCount; j++)
                {
                    var ringJs = new JArray();
                    var ring = polygon.ElementAt(j);
                    for (int k = 1; k <= ring.PointCount; k++)
                    {
                        var point = ring.PointAt(k);
                        ringJs.Add(new JArray(point.Longitude, point.Latitude));
                    }

                    polygonJs.Add(ringJs);
                }

                coordinates.Add(polygonJs);
            }

            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            result.Add("coordinates", coordinates);
            return result;
        }

        private static JObject GetGeoJSONMultiLineStringFromDbGeography(DbGeography geography)
        {
            JArray coordinates = new JArray();
            for (int i = 1; i <= geography.ElementCount; i++)
            {
                JArray jsonLine = new JArray();
                var line = geography.ElementAt(i);
                for (int j = 1; j <= line.PointCount; j++)
                {
                    var point = line.PointAt(j);
                    jsonLine.Add(new JArray(point.Longitude, point.Latitude));
                }

                coordinates.Add(jsonLine);
            }

            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            result.Add("coordinates", coordinates);
            return result;
        }

        private static JObject GetGeoJSONPolygonFromDbGeography(DbGeography geography)
        {
            JArray coordinates = new JArray();
            for (int i = 1; i <= geography.ElementCount; i++)
            {
                JArray ring = new JArray();
                var geoRing = geography.ElementAt(i);
                for (int j = 1; j <= geoRing.PointCount; j++)
                {
                    var point = geoRing.PointAt(j);
                    ring.Add(new JArray(point.Longitude, point.Latitude));
                }

                coordinates.Add(ring);
            }

            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            result.Add("coordinates", coordinates);
            return result;
        }

        private static JObject GetGeoJSONLineStringOrMultiPointFromDbGeography(DbGeography geography)
        {
            JArray coordinates = new JArray();
            for (int i = 1; i <= geography.PointCount; i++)
            {
                JArray coordinate = new JArray(geography.Longitude, geography.Latitude);
                coordinates.Add(coordinate);
            }

            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            result.Add("coordinates", coordinates);
            return result;
        }

        private static JObject GetGeoJSONPointFromDbGeography(DbGeography geography)
        {
            JObject result = new JObject();
            result.Add("type", geography.SpatialTypeName);
            JArray coordinate = new JArray(geography.Longitude, geography.Latitude);
            result.Add("coordinates", coordinate);
            return result;
        }

        #endregion

        #region To DbGeography

        private static DbGeography GetDbGeographyFromPoint(JToken geometry)
        {
            JArray coordinates = geometry.SelectToken("coordinates").Value<JArray>();
            double x = coordinates[0].Value<double>();
            double y = coordinates[1].Value<double>();
            string pointText = string.Concat(
                "POINT(", x.ToString(culture), " ", y.ToString(culture), ")");
            return DbGeography.PointFromText(pointText, 4326);
        }

        private static DbGeography GetDbGeographyFromLineString(JToken geometry)
        {
            JArray coordinates = geometry.SelectToken("coordinates").Value<JArray>();

            StringBuilder lineText = new StringBuilder("LINESTRING(");
            bool isFirst = true;
            foreach (var coordinate in coordinates)
            {
                double x = coordinate[0].Value<double>();
                double y = coordinate[1].Value<double>();
                if (!isFirst) 
                {
                    lineText.Append(", ");
                }

                lineText.Append(x.ToString(culture))
                    .Append(" ")
                    .Append(y.ToString(culture));
                isFirst = false;
            }

            lineText.Append(")");
            
            return DbGeography.LineFromText(lineText.ToString(), 4326);
        }

        private static DbGeography GetDbGeographyFromPolygon(JToken geometry)
        {
            JArray coordinates = geometry.SelectToken("coordinates").Value<JArray>();
            StringBuilder polygonText = new StringBuilder("POLYGON(");
            foreach (var ring in coordinates)
            {
                polygonText.Append("(");
                bool isFirst = true;
                foreach (var coordinate in ring)
                {
                    double x = coordinate[0].Value<double>();
                    double y = coordinate[1].Value<double>();
                    if (!isFirst)
                    {
                        polygonText.Append(", ");
                    }

                    polygonText.Append(x.ToString(culture))
                        .Append(" ")
                        .Append(y.ToString(culture));
                    isFirst = false;
                }

                polygonText.Append(")");
            }

            polygonText.Append(")");

            return DbGeography.PolygonFromText(polygonText.ToString(), 4326);
            throw new System.NotImplementedException();
        }

        #endregion
    }
}