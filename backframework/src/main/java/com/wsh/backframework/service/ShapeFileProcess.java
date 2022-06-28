package com.wsh.backframework.service;

import gov.nasa.worldwind.formats.shapefile.Shapefile;
import gov.nasa.worldwind.formats.shapefile.ShapefileRecord;

import java.util.List;
import java.util.Map;

public interface ShapeFileProcess {
    /**
     * 解析shape中的所有字段信息
     * @param shapefile
     * @return
     */
    List<Map<String,String>> ShapeFileAnalysis(Shapefile shapefile);

    /**
     * ShapefileRecord解析出WKT
     * @param shapefileRecord
     * @return
     */
    Map<String,String> ShapefileRecordToWKT(ShapefileRecord shapefileRecord);

    /**
     * WKT转GeoJSON接口
     * @param WKT
     * @return
     */
    String WKTTOJson(String WKT);
}
