package com.vanilladream.backend.quest.dto;

import java.time.LocalDateTime;

import com.vanilladream.backend.character.JobType;
import com.vanilladream.backend.quest.CharacterQuest;
import com.vanilladream.backend.quest.Quest;
import com.vanilladream.backend.quest.QuestStatus;
import com.vanilladream.backend.quest.QuestTargetType;
import com.vanilladream.backend.quest.QuestType;
import com.vanilladream.backend.quest.UnlockFeature;

public record QuestResponse(
    Long id,
    String code,
    String title,
    String description,
    QuestType questType,
    JobType jobRestriction,
    Long prerequisiteQuestId,
    QuestTargetType requiredTargetType,
    Long requiredTargetId,
    int requiredCount,
    int rewardBeads,
    int rewardExp,
    Long rewardItemId,
    String rewardTitle,
    UnlockFeature unlockFeature,
    boolean promotionQuest,
    int sortOrder,
    QuestStatus status,
    int progressCount,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    boolean claimable
) {

    public static QuestResponse from(Quest quest, CharacterQuest characterQuest) {
        return new QuestResponse(
            quest.getId(),
            quest.getCode(),
            quest.getTitle(),
            quest.getDescription(),
            quest.getQuestType(),
            quest.getJobRestriction(),
            quest.getPrerequisiteQuestId(),
            quest.getRequiredTargetType(),
            quest.getRequiredTargetId(),
            quest.getRequiredCount(),
            quest.getRewardBeads(),
            quest.getRewardExp(),
            quest.getRewardItemId(),
            quest.getRewardTitle(),
            quest.getUnlockFeature(),
            quest.isPromotionQuest(),
            quest.getSortOrder(),
            characterQuest.getStatus(),
            characterQuest.getProgressCount(),
            characterQuest.getStartedAt(),
            characterQuest.getCompletedAt(),
            characterQuest.getStatus() == QuestStatus.COMPLETED
        );
    }
}
