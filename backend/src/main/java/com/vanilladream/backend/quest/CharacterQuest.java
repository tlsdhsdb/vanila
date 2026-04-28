package com.vanilladream.backend.quest;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "character_quests",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_character_quests_character_quest", columnNames = {"character_id", "quest_id"})
    }
)
public class CharacterQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long characterId;

    @Column(nullable = false)
    private Long questId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestStatus status;

    @Column(nullable = false)
    private int progressCount;

    @Column
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime completedAt;

    protected CharacterQuest() {
    }

    private CharacterQuest(Long characterId, Long questId, QuestStatus status) {
        this.characterId = characterId;
        this.questId = questId;
        this.status = status;
        this.progressCount = 0;

        if (status != QuestStatus.LOCKED) {
            this.startedAt = LocalDateTime.now();
        }
    }

    public static CharacterQuest create(Long characterId, Long questId, QuestStatus status) {
        return new CharacterQuest(characterId, questId, status);
    }

    public void lock() {
        if (status == QuestStatus.CLAIMED) {
            return;
        }

        this.status = QuestStatus.LOCKED;
    }

    public void activate(int progressCount) {
        if (status == QuestStatus.CLAIMED) {
            return;
        }

        this.progressCount = progressCount;
        this.status = QuestStatus.ACTIVE;

        if (startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
    }

    public void complete(int progressCount) {
        if (status == QuestStatus.CLAIMED) {
            return;
        }

        this.progressCount = progressCount;
        this.status = QuestStatus.COMPLETED;

        if (startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }

        if (completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public void increaseProgress(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Quest progress amount must be positive");
        }

        if (status == QuestStatus.CLAIMED) {
            return;
        }

        this.progressCount += amount;

        if (status == QuestStatus.ACTIVE && startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
    }

    public void claim() {
        this.status = QuestStatus.CLAIMED;

        if (completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public boolean isClaimed() {
        return status == QuestStatus.CLAIMED;
    }

    public Long getId() {
        return id;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public Long getQuestId() {
        return questId;
    }

    public QuestStatus getStatus() {
        return status;
    }

    public int getProgressCount() {
        return progressCount;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
