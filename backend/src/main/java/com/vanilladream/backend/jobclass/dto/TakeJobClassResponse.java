package com.vanilladream.backend.jobclass.dto;

import java.util.List;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterStat;
import com.vanilladream.backend.character.dto.CharacterResponse;
import com.vanilladream.backend.jobclass.JobClass;
import com.vanilladream.backend.jobclass.JobClassStatReward;

public record TakeJobClassResponse(
    JobClassResponse jobClass,
    int spentBeads,
    int rewardExp,
    int previousLevel,
    int currentLevel,
    boolean leveledUp,
    CharacterResponse character
) {

    public static TakeJobClassResponse from(
        JobClass jobClass,
        List<JobClassStatReward> statRewards,
        int previousLevel,
        Character character,
        List<CharacterStat> characterStats
    ) {
        return new TakeJobClassResponse(
            JobClassResponse.from(jobClass, statRewards, true),
            jobClass.getCostBeads(),
            jobClass.getRewardExp(),
            previousLevel,
            character.getLevel(),
            character.getLevel() > previousLevel,
            CharacterResponse.from(character, characterStats)
        );
    }
}
