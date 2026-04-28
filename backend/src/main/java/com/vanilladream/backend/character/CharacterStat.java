package com.vanilladream.backend.character;

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
    name = "character_stats",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_character_stats_character_type", columnNames = {"character_id", "stat_type"})
    }
)
public class CharacterStat {

    public static final int STARTING_VALUE = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long characterId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private StatType statType;

    @Column(name = "stat_value", nullable = false)
    private int value;

    protected CharacterStat() {
    }

    private CharacterStat(Long characterId, StatType statType, int value) {
        this.characterId = characterId;
        this.statType = statType;
        this.value = value;
    }

    public static CharacterStat createStartingStat(Long characterId, StatType statType) {
        return new CharacterStat(characterId, statType, STARTING_VALUE);
    }

    public void increaseBy(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Stat reward amount must be positive");
        }

        this.value += amount;
    }

    public Long getId() {
        return id;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public StatType getStatType() {
        return statType;
    }

    public int getValue() {
        return value;
    }
}
