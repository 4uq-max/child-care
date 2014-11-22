declare module App {
    export interface Geofence {
        Id: number;
        Name: string;
        BufferRadius;
        GroupId: number;
        Type: string;
        Visible: boolean;
        Feature? ;
        GeoJSONBuffered? ;
    }
}