package com.vanilladream.backend.auth.dto;

import java.time.LocalDateTime;

import com.vanilladream.backend.auth.Account;
import com.vanilladream.backend.auth.AccountRole;

public record AccountResponse(
    Long id,
    String email,
    String username,
    AccountRole role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(
            account.getId(),
            account.getEmail(),
            account.getUsername(),
            account.getRole(),
            account.getCreatedAt(),
            account.getUpdatedAt()
        );
    }
}

