package com.wsh.backframework.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LayerVO {
    private Integer id;

    private String name;

    private String url;

    private String type;

    private List<LayerVO> children;

}
