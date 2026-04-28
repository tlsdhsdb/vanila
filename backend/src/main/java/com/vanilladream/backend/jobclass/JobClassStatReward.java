package com.vanilladream.backend.jobclass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.vanilladream.backend.character.StatType;

@Entity
@Table(name = "job_class_stat_rewards")
public class JobClassStatReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobClassId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private StatType statType;

    @Column(nullable = false)
    private int rewardAmount;

    protected JobClassStatReward() {
    }

    public Long getId() {
        return id;
    }

    public Long getJobClassId() {
        return jobClassId;
    }

    public StatType getStatType() {
        return statType;
    }

    public int getRewardAmount() {
        return rewardAmount;
    }
}
