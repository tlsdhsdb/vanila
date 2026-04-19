package com.vanilladream.backend.common.health;

import java.time.OffsetDateTime;

public record HealthCheckResponse(
    String status,
    String application,
    OffsetDateTime timestamp
) {
}

