package com.vanilladream.backend.character.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.vanilladream.backend.character.FacePreset;
import com.vanilladream.backend.character.HairColor;
import com.vanilladream.backend.character.HairStyle;
import com.vanilladream.backend.character.SkinTone;

public record CharacterCreateRequest(
    @NotBlank
    @Size(min = 2, max = 20)
    @Pattern(regexp = "^[A-Za-z0-9 _-]+$", message = "must contain only letters, numbers, spaces, underscores, and hyphens")
    String name,

    @NotNull
    SkinTone skinTone,

    @NotNull
    HairStyle hairStyle,

    @NotNull
    HairColor hairColor,

    @NotNull
    FacePreset facePreset
) {
}
