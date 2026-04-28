package com.vanilladream.backend.quest;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.vanilladream.backend.character.JobType;

@Entity
@Table(name = "quests")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String code;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 400)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QuestType questType;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private JobType jobRestriction;

    @Column
    private Long prerequisiteQuestId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private QuestTargetType requiredTargetType;

    @Column
    private Long requiredTargetId;

    @Column(nullable = false)
    private int requiredCount;

    @Column(nullable = false)
    private int rewardBeads;

    @Column(nullable = false)
    private int rewardExp;

    @Column
    private Long rewardItemId;

    @Column(length = 60)
    private String rewardTitle;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private UnlockFeature unlockFeature;

    @Column(name = "is_promotion_quest", nullable = false)
    private boolean promotionQuest;

    @Column(nullable = false)
    private int sortOrder;

    protected Quest() {
    }

    public boolean matchesTarget(QuestTargetType targetType, Long targetId) {
        return requiredTargetType == targetType
            && (requiredTargetId == null || Objects.equals(requiredTargetId, targetId));
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public QuestType getQuestType() {
        return questType;
    }

    public JobType getJobRestriction() {
        return jobRestriction;
    }

    public Long getPrerequisiteQuestId() {
        return prerequisiteQuestId;
    }

    public QuestTargetType getRequiredTargetType() {
        return requiredTargetType;
    }

    public Long getRequiredTargetId() {
        return requiredTargetId;
    }

    public int getRequiredCount() {
        return requiredCount;
    }

    public int getRewardBeads() {
        return rewardBeads;
    }

    public int getRewardExp() {
        return rewardExp;
    }

    public Long getRewardItemId() {
        return rewardItemId;
    }

    public String getRewardTitle() {
        return rewardTitle;
    }

    public UnlockFeature getUnlockFeature() {
        return unlockFeature;
    }

    public boolean isPromotionQuest() {
        return promotionQuest;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
