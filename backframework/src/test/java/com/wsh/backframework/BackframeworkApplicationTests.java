package com.wsh.backframework;



import com.wsh.backframework.domain.Layer;
import com.wsh.backframework.mapper.LayerMapper;
import gov.nasa.worldwind.layers.LayerList;
import org.assertj.core.api.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.List;

@SpringBootTest
class BackframeworkApplicationTests {

    @Autowired
    private LayerMappexir layerMapper;

    @Test
    void contextLoads() {
        System.out.println(("----- selectAll method test ------"));
        List<Layer> layerList = layerMapper.selectList(null);
        layerList.forEach(System.out::println);
    }

    @Test
    public void testSelect(){
        System.out.println(("----- selectAll method test ------"));
        List<Layer> layerList = layerMapper.selectList(null);
        layerList.forEach(System.out::println);
    }

}
