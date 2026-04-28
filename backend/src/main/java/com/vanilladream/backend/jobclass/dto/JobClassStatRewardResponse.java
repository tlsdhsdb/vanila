package com.vanilladream.backend.jobclass.dto;

import com.vanilladream.backend.character.StatType;
import com.vanilladream.backend.jobclass.JobClassStatReward;

public record JobClassStatRewardResponse(
    StatType statType,
    int rewardAmount
) {

    public static JobClassStatRewardResponse from(JobClassStatReward reward) {
        return new JobClassStatRewardResponse(reward.getStatType(), reward.getRewardAmount());
    }
}
