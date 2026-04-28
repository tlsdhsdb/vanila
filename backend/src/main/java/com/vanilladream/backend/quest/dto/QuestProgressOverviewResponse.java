package com.vanilladream.backend.quest.dto;

import java.util.List;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.quest.QuestStatus;

public record QuestProgressOverviewResponse(
    int totalCount,
    int activeCount,
    int completedCount,
    int claimedCount,
    int lockedCount,
    int currentLevel,
    int currentExp
) {

    public static QuestProgressOverviewResponse from(Character character, List<QuestResponse> quests) {
        return new QuestProgressOverviewResponse(
            quests.size(),
            countByStatus(quests, QuestStatus.ACTIVE),
            countByStatus(quests, QuestStatus.COMPLETED),
            countByStatus(quests, QuestStatus.CLAIMED),
            countByStatus(quests, QuestStatus.LOCKED),
            character.getLevel(),
            character.getExp()
        );
    }

    private static int countByStatus(List<QuestResponse> quests, QuestStatus status) {
        return (int) quests.stream().filter(quest -> quest.status() == status).count();
    }
}
