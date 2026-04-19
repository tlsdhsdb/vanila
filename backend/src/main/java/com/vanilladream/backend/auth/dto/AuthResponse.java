package com.vanilladream.backend.auth.dto;

public record AuthResponse(
    String tokenType,
    String accessToken,
    AccountResponse account
) {
}

