package com.vanilladream.backend.character.dto;

import jakarta.validation.constraints.NotNull;

import com.vanilladream.backend.character.FacePreset;
import com.vanilladream.backend.character.HairColor;
import com.vanilladream.backend.character.HairStyle;
import com.vanilladream.backend.character.SkinTone;

public record AppearanceUpdateRequest(
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
