package com.APIs.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class test {

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        String data = "{\"message\" : \"Hello World!\"}";
        return ResponseEntity.ok(data);
    }
}
