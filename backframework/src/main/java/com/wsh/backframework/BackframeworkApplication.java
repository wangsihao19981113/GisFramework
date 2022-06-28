package com.wsh.backframework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class BackframeworkApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackframeworkApplication.class, args);
    }

}
