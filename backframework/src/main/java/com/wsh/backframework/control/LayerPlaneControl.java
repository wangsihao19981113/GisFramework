package com.wsh.backframework.control;

import com.wsh.backframework.domain.Layer;
import com.wsh.backframework.domain.LayerVO;
import com.wsh.backframework.mapper.LayerMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/layerplane")
public class LayerPlaneControl {
    @Autowired
    private LayerMapper layerMapper;

    @GetMapping("/query")
    public List<Layer> query(){
        HashMap<String,Object> map=new HashMap<>();
        map.put("systemid","123");
        List<Layer> layers = layerMapper.selectByMap(map);
        return layers;
    }

    @GetMapping("/querytotree")
    public List<LayerVO> querytotree(){
        HashMap<String,Object> map=new HashMap<>();
        map.put("systemid","123");
        List<Layer> layers = layerMapper.selectByMap(map);
        Map<Integer,List<LayerVO>> parentIdLayerVOMap = new HashMap<>();
        List<LayerVO> layerVOList = new ArrayList<>();
        for(Layer layer : layers){
            LayerVO layerVO = new LayerVO();
            BeanUtils.copyProperties(layer,layerVO);
            layerVOList.add(layerVO);
            int parentId = layer.getParentId();
            if(parentIdLayerVOMap.containsKey(parentId))
            {
                List<LayerVO> LayerVOS = parentIdLayerVOMap.get(parentId);
                LayerVOS.add(layerVO);
            }
            else{
                List<LayerVO> LayerVOS = new ArrayList<>();
                LayerVOS.add(layerVO);
                parentIdLayerVOMap.put(parentId,LayerVOS);
            }
        }

        for(LayerVO layerVO : layerVOList){
            List<LayerVO> children = parentIdLayerVOMap.get(layerVO.getId());
            layerVO.setChildren(children);
        }

        List<LayerVO> result  = parentIdLayerVOMap.get(0);

        return result;
    }

}
