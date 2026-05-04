package com.sentinel;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Objects;

@SpringBootApplication
@EnableScheduling
public class SentinelApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        if (System.getProperty("PORT") != null) {
            System.setProperty("server.port", System.getProperty("PORT"));
        }
        if (System.getProperty("MONGO_URI") != null) {
            System.setProperty("spring.data.mongodb.uri", System.getProperty("MONGO_URI"));
        }
        SpringApplication.run(SentinelApplication.class, args);
    }
}
