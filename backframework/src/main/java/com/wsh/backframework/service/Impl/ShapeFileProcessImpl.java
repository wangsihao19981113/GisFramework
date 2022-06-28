package com.wsh.backframework.service.Impl;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.WKTReader;
import com.wsh.backframework.service.ShapeFileProcess;
import gov.nasa.worldwind.formats.shapefile.DBaseRecord;
import gov.nasa.worldwind.formats.shapefile.Shapefile;
import gov.nasa.worldwind.formats.shapefile.ShapefileRecord;
import gov.nasa.worldwind.util.CompoundVecBuffer;
import org.geotools.geojson.geom.GeometryJSON;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.*;

@Service
public class ShapeFileProcessImpl implements ShapeFileProcess {
    @Override
    public List<Map<String, String>> ShapeFileAnalysis(Shapefile shapefile) {
        List<Map<String,String>> list = new ArrayList<>();
        while(shapefile.hasNext())
        {
            Map<String,String> map = new HashMap<>();
            ShapefileRecord record = shapefile.nextRecord(); // 获取一条记录
            DBaseRecord dBaseRecord = record.getAttributes(); // 获取该记录的属性信息
            Object[] entries = dBaseRecord.getEntries().toArray();
            for (int i = 0; i < entries.length; i++)
            {
                String entry = entries[i].toString();
                map.put(entry.substring(0,entry.lastIndexOf("=")),entry.substring(entry.lastIndexOf("=")+1));
            }
            Map<String,String> geomap = ShapefileRecordToWKT(record);
            map.put("WKTString",geomap.get("WKTString"));
            map.put("GeoJSON",WKTTOJson(geomap.get("WKTString")));
            list.add(map);
        }
        return list;
    }

    @Override
    public Map<String, String> ShapefileRecordToWKT(ShapefileRecord shapefileRecord) {
        CompoundVecBuffer buffer =  shapefileRecord.getCompoundPointBuffer();
        String type = shapefileRecord.getShapeType();
        String ctype = type.substring(type.lastIndexOf(".")+1);
        Map<String, String> map = new HashMap<>();
        if(ctype.equals("ShapePoint")) {
            String PointString = "POINT(";
            Iterator<double[]> a = buffer.getCoords().iterator();
            while (a.hasNext()) {
                double[] b = a.next();
                PointString = PointString + b[0] + " " + b[1];
            }
            PointString = PointString + ")";
            map.put("WKTString",PointString);
        }
        else if (ctype.equals("ShapePolyline") ){
            Iterator<double[]> a = buffer.getCoords().iterator();
            String LineString = "LINESTRING(";
            while (a.hasNext()) {
                double[] b = a.next();
                if(a.hasNext()) {
                    LineString = LineString + b[0] + " " + b[1] + ",";
                }
                else{
                    LineString = LineString + b[0] + " " + b[1];
                }
            }
            LineString = LineString + ")";
            map.put("WKTString",LineString);
        }
        else if (ctype.equals("ShapePolygon")){
            Iterator<double[]> a = buffer.getCoords().iterator();
            String PolygonString = "Polygon((";
            while (a.hasNext()) {
                double[] b = a.next();
                if(a.hasNext()) {
                    PolygonString = PolygonString + b[0] + " " + b[1] + ",";
                }
                else{
                    PolygonString = PolygonString + b[0] + " " + b[1];
                }
            }
            PolygonString = PolygonString + "))";
            map.put("WKTString",PolygonString);
        }
        else{
            map.put("WKTString",null);
        }
        return map;
    }

    @Override
    public String WKTTOJson(String WKT) {
        String json = null;
        try {
            WKTReader reader = new WKTReader();
            Geometry geometry = reader.read(WKT);
            StringWriter writer = new StringWriter();
            GeometryJSON g = new GeometryJSON(20);
            g.write(geometry, writer);
            json = writer.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json;
    }
}
