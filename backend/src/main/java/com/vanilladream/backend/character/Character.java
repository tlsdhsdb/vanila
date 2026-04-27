package com.vanilladream.backend.character;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "characters")
public class Character {

    public static final int STARTING_LEVEL = 1;
    public static final int STARTING_EXP = 0;
    public static final int STARTING_BEADS = 300;
    public static final String STARTING_TITLE = "New Resident";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long accountId;

    @Column(nullable = false, length = 20)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SkinTone skinTone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HairStyle hairStyle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HairColor hairColor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FacePreset facePreset;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private JobType job;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int exp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PromotionTier promotionTier;

    @Column(nullable = false)
    private int beads;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CharacterLocation currentLocation;

    @Column(nullable = false, length = 60)
    private String title;

    @Column(nullable = false)
    private LocalDateTime lastActiveAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected Character() {
    }

    private Character(
        Long accountId,
        String name,
        SkinTone skinTone,
        HairStyle hairStyle,
        HairColor hairColor,
        FacePreset facePreset
    ) {
        this.accountId = accountId;
        this.name = name;
        this.skinTone = skinTone;
        this.hairStyle = hairStyle;
        this.hairColor = hairColor;
        this.facePreset = facePreset;
        this.level = STARTING_LEVEL;
        this.exp = STARTING_EXP;
        this.promotionTier = PromotionTier.BEGINNER;
        this.beads = STARTING_BEADS;
        this.currentLocation = CharacterLocation.MAIN_PLAZA;
        this.title = STARTING_TITLE;
    }

    public static Character create(
        Long accountId,
        String name,
        SkinTone skinTone,
        HairStyle hairStyle,
        HairColor hairColor,
        FacePreset facePreset
    ) {
        return new Character(accountId, name, skinTone, hairStyle, hairColor, facePreset);
    }

    public void updateAppearance(
        SkinTone skinTone,
        HairStyle hairStyle,
        HairColor hairColor,
        FacePreset facePreset
    ) {
        this.skinTone = skinTone;
        this.hairStyle = hairStyle;
        this.hairColor = hairColor;
        this.facePreset = facePreset;
        markActive();
    }

    public void selectJob(JobType job) {
        this.job = job;
        markActive();
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.lastActiveAt = now;
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private void markActive() {
        this.lastActiveAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public String getName() {
        return name;
    }

    public SkinTone getSkinTone() {
        return skinTone;
    }

    public HairStyle getHairStyle() {
        return hairStyle;
    }

    public HairColor getHairColor() {
        return hairColor;
    }

    public FacePreset getFacePreset() {
        return facePreset;
    }

    public JobType getJob() {
        return job;
    }

    public int getLevel() {
        return level;
    }

    public int getExp() {
        return exp;
    }

    public PromotionTier getPromotionTier() {
        return promotionTier;
    }

    public int getBeads() {
        return beads;
    }

    public CharacterLocation getCurrentLocation() {
        return currentLocation;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
