package com.wsh;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
//@MapperScan("com.wsh.backframework.mapper")
public class BackframeworkApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackframeworkApplication.class, args);
        
    }

}
