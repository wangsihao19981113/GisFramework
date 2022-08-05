package com.wsh.backframework.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("layers")
public class Layer {
    private Integer id;

    private String name;

    private String url;

    private String type;

    private Integer parentId;

    private String systemid;

}