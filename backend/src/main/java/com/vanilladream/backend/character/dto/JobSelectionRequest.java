package com.vanilladream.backend.character.dto;

import jakarta.validation.constraints.NotNull;

import com.vanilladream.backend.character.JobType;

public record JobSelectionRequest(
    @NotNull
    JobType job
) {
}
