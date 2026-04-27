package com.vanilladream.backend.character.dto;

import com.vanilladream.backend.character.CharacterStat;
import com.vanilladream.backend.character.StatType;

public record CharacterStatResponse(
    StatType statType,
    int value
) {

    public static CharacterStatResponse from(CharacterStat stat) {
        return new CharacterStatResponse(stat.getStatType(), stat.getValue());
    }
}
