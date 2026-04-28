package com.vanilladream.backend.quest.dto;

import com.vanilladream.backend.character.dto.CharacterResponse;

public record ClaimQuestResponse(
    QuestResponse quest,
    int rewardBeads,
    int rewardExp,
    String rewardTitle,
    CharacterResponse character
) {
}
