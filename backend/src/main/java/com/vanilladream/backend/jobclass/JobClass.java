package com.vanilladream.backend.jobclass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import com.vanilladream.backend.character.JobType;
import com.vanilladream.backend.character.PromotionTier;

@Entity
@Table(
    name = "job_classes",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_job_classes_job_name", columnNames = {"job", "name"})
    }
)
public class JobClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobType job;

    @Column(nullable = false)
    private int costBeads;

    @Column(nullable = false)
    private int rewardExp;

    @Column(nullable = false)
    private boolean repeatable;

    @Column(nullable = false)
    private int unlockLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PromotionTier unlockPromotionTier;

    protected JobClass() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public JobType getJob() {
        return job;
    }

    public int getCostBeads() {
        return costBeads;
    }

    public int getRewardExp() {
        return rewardExp;
    }

    public boolean isRepeatable() {
        return repeatable;
    }

    public int getUnlockLevel() {
        return unlockLevel;
    }

    public PromotionTier getUnlockPromotionTier() {
        return unlockPromotionTier;
    }
}
