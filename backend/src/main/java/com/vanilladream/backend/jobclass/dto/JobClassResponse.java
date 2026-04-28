package com.vanilladream.backend.jobclass.dto;

import java.util.List;

import com.vanilladream.backend.character.JobType;
import com.vanilladream.backend.character.PromotionTier;
import com.vanilladream.backend.jobclass.JobClass;
import com.vanilladream.backend.jobclass.JobClassStatReward;

public record JobClassResponse(
    Long id,
    String name,
    JobType job,
    int costBeads,
    int rewardExp,
    boolean repeatable,
    int unlockLevel,
    PromotionTier unlockPromotionTier,
    boolean available,
    List<JobClassStatRewardResponse> statRewards
) {

    public static JobClassResponse from(
        JobClass jobClass,
        List<JobClassStatReward> statRewards,
        boolean available
    ) {
        return new JobClassResponse(
            jobClass.getId(),
            jobClass.getName(),
            jobClass.getJob(),
            jobClass.getCostBeads(),
            jobClass.getRewardExp(),
            jobClass.isRepeatable(),
            jobClass.getUnlockLevel(),
            jobClass.getUnlockPromotionTier(),
            available,
            statRewards.stream().map(JobClassStatRewardResponse::from).toList()
        );
    }
}
