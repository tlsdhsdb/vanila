package com.vanilladream.backend.character.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterLocation;
import com.vanilladream.backend.character.CharacterStat;
import com.vanilladream.backend.character.FacePreset;
import com.vanilladream.backend.character.HairColor;
import com.vanilladream.backend.character.HairStyle;
import com.vanilladream.backend.character.JobType;
import com.vanilladream.backend.character.PromotionTier;
import com.vanilladream.backend.character.SkinTone;

public record CharacterResponse(
    Long id,
    Long accountId,
    String name,
    SkinTone skinTone,
    HairStyle hairStyle,
    HairColor hairColor,
    FacePreset facePreset,
    JobType job,
    int level,
    int exp,
    PromotionTier promotionTier,
    int beads,
    CharacterLocation currentLocation,
    String title,
    LocalDateTime lastActiveAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<CharacterStatResponse> stats
) {

    public static CharacterResponse from(Character character, List<CharacterStat> stats) {
        return new CharacterResponse(
            character.getId(),
            character.getAccountId(),
            character.getName(),
            character.getSkinTone(),
            character.getHairStyle(),
            character.getHairColor(),
            character.getFacePreset(),
            character.getJob(),
            character.getLevel(),
            character.getExp(),
            character.getPromotionTier(),
            character.getBeads(),
            character.getCurrentLocation(),
            character.getTitle(),
            character.getLastActiveAt(),
            character.getCreatedAt(),
            character.getUpdatedAt(),
            stats.stream().map(CharacterStatResponse::from).toList()
        );
    }
}
