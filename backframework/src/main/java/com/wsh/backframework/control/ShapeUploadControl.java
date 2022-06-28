package com.wsh.backframework.control;


import com.wsh.backframework.service.ShapeFileProcess;
import gov.nasa.worldwind.formats.shapefile.Shapefile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/shapefile")
public class ShapeUploadControl {
    @Autowired
    private ShapeFileProcess shapeFileProcess;


    @PostMapping("/upload")
    public List<Map<String,String>> uploadShapefile(@RequestParam("uploadFile") MultipartFile[] multipartFiles) throws IOException {
        InputStream shpInputStream = null;
        InputStream shxInputStream = null;
        InputStream dbfInputStream = null;
        InputStream prjInputStream = null;
        int i;
        for(i = 0 ; i < multipartFiles.length ; i++)
        {
            String filename = multipartFiles[i].getOriginalFilename();

            switch (filename.substring(filename.lastIndexOf("."))){
                case (".shp"):
                    shpInputStream = getFileStream(multipartFiles[i]);
                    break;
                case (".shx"):
                    shxInputStream = getFileStream(multipartFiles[i]);
                    break;
                case (".dbf"):
                    dbfInputStream = getFileStream(multipartFiles[i]);
                    break;
                case (".prj"):
                    prjInputStream = getFileStream(multipartFiles[i]);
                    break;
            }
        }
        Shapefile shapefile = new Shapefile(shpInputStream, shxInputStream,
                dbfInputStream, prjInputStream);
        return shapeFileProcess.ShapeFileAnalysis(shapefile);
    }

    public InputStream getFileStream(MultipartFile sourceFile) throws IOException {
        InputStream inputStream = null;
        File file = null;
        file = File.createTempFile("temp", null);
        sourceFile.transferTo(file);   //sourceFile为传入的MultipartFile
        inputStream = new FileInputStream(file);
        file.deleteOnExit();
        return inputStream;
    }
}
