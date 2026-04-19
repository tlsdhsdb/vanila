package com.vanilladream.backend.common.health;

import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vanilladream.backend.common.api.ApiResponse;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @Value("${spring.application.name}")
    private String applicationName;

    @GetMapping
    public ApiResponse<HealthCheckResponse> getHealth() {
        HealthCheckResponse response = new HealthCheckResponse(
            "UP",
            applicationName,
            OffsetDateTime.now()
        );

        return ApiResponse.success(response);
    }
}

