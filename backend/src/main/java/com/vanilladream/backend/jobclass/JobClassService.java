package com.vanilladream.backend.jobclass;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterRepository;
import com.vanilladream.backend.character.CharacterStat;
import com.vanilladream.backend.character.CharacterStatRepository;
import com.vanilladream.backend.character.StatType;
import com.vanilladream.backend.common.exception.ApiException;
import com.vanilladream.backend.jobclass.dto.JobClassResponse;
import com.vanilladream.backend.jobclass.dto.TakeJobClassResponse;
import com.vanilladream.backend.quest.QuestProgressService;
import com.vanilladream.backend.quest.QuestTargetType;

@Service
@Transactional(readOnly = true)
public class JobClassService {

    private final CharacterRepository characterRepository;
    private final CharacterStatRepository characterStatRepository;
    private final JobClassRepository jobClassRepository;
    private final JobClassStatRewardRepository jobClassStatRewardRepository;
    private final QuestProgressService questProgressService;

    public JobClassService(
        CharacterRepository characterRepository,
        CharacterStatRepository characterStatRepository,
        JobClassRepository jobClassRepository,
        JobClassStatRewardRepository jobClassStatRewardRepository,
        QuestProgressService questProgressService
    ) {
        this.characterRepository = characterRepository;
        this.characterStatRepository = characterStatRepository;
        this.jobClassRepository = jobClassRepository;
        this.jobClassStatRewardRepository = jobClassStatRewardRepository;
        this.questProgressService = questProgressService;
    }

    public List<JobClassResponse> getClasses(Long accountId) {
        Character character = findReadyCharacter(accountId);
        List<JobClass> jobClasses = jobClassRepository.findByJobOrderByIdAsc(character.getJob());
        Map<Long, List<JobClassStatReward>> rewardsByClassId = jobClassStatRewardRepository
            .findByJobClassIdInOrderByJobClassIdAscIdAsc(jobClasses.stream().map(JobClass::getId).toList())
            .stream()
            .collect(Collectors.groupingBy(JobClassStatReward::getJobClassId));

        return jobClasses.stream()
            .map(jobClass -> JobClassResponse.from(
                jobClass,
                rewardsByClassId.getOrDefault(jobClass.getId(), List.of()),
                isUnlocked(character, jobClass)
            ))
            .toList();
    }

    @Transactional
    public TakeJobClassResponse takeClass(Long accountId, Long classId) {
        Character character = findReadyCharacter(accountId);
        JobClass jobClass = jobClassRepository.findByIdAndJob(classId, character.getJob())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Class was not found"));

        if (!isUnlocked(character, jobClass)) {
            throw new ApiException(HttpStatus.CONFLICT, "Class is locked");
        }

        if (character.getBeads() < jobClass.getCostBeads()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Not enough Beads to take this class");
        }

        List<JobClassStatReward> statRewards = jobClassStatRewardRepository.findByJobClassIdOrderByIdAsc(jobClass.getId());
        Map<StatType, CharacterStat> characterStats = characterStatRepository
            .findByCharacterIdOrderByStatTypeAsc(character.getId())
            .stream()
            .collect(Collectors.toMap(CharacterStat::getStatType, Function.identity()));

        if (characterStats.isEmpty()) {
            throw new ApiException(HttpStatus.CONFLICT, "Character job stats are not initialized");
        }

        int previousLevel = character.getLevel();
        character.spendBeads(jobClass.getCostBeads());
        character.gainExp(jobClass.getRewardExp());

        for (JobClassStatReward statReward : statRewards) {
            CharacterStat characterStat = characterStats.get(statReward.getStatType());

            if (characterStat == null) {
                throw new ApiException(HttpStatus.CONFLICT, "Character job stats are not initialized");
            }

            characterStat.increaseBy(statReward.getRewardAmount());
        }

        characterRepository.saveAndFlush(character);
        characterStatRepository.saveAllAndFlush(characterStats.values().stream().toList());
        questProgressService.recordProgress(character, QuestTargetType.CLASS_TAKE, jobClass.getId(), 1);

        return TakeJobClassResponse.from(
            jobClass,
            statRewards,
            previousLevel,
            character,
            characterStatRepository.findByCharacterIdOrderByStatTypeAsc(character.getId())
        );
    }

    private Character findReadyCharacter(Long accountId) {
        Character character = characterRepository.findByAccountId(accountId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Character has not been created"));

        if (character.getJob() == null) {
            throw new ApiException(HttpStatus.CONFLICT, "Job has not been selected");
        }

        return character;
    }

    private boolean isUnlocked(Character character, JobClass jobClass) {
        return character.getLevel() >= jobClass.getUnlockLevel()
            && character.getPromotionTier() == jobClass.getUnlockPromotionTier();
    }
}
