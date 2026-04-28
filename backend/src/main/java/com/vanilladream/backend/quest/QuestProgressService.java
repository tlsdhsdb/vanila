package com.vanilladream.backend.quest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterLocation;
import com.vanilladream.backend.character.JobType;

@Service
@Transactional
public class QuestProgressService {

    private final QuestRepository questRepository;
    private final CharacterQuestRepository characterQuestRepository;

    public QuestProgressService(
        QuestRepository questRepository,
        CharacterQuestRepository characterQuestRepository
    ) {
        this.questRepository = questRepository;
        this.characterQuestRepository = characterQuestRepository;
    }

    public List<QuestProgressView> syncQuests(Character character) {
        List<Quest> quests = questRepository.findAllByOrderBySortOrderAscIdAsc();
        Map<Long, CharacterQuest> questsById = ensureCharacterQuestStates(character.getId(), quests).stream()
            .collect(Collectors.toMap(CharacterQuest::getQuestId, Function.identity()));

        for (Quest quest : quests) {
            CharacterQuest characterQuest = questsById.get(quest.getId());
            syncQuestState(character, quest, characterQuest, questsById);
        }

        return quests.stream()
            .map(quest -> new QuestProgressView(quest, questsById.get(quest.getId())))
            .toList();
    }

    public void recordProgress(
        Character character,
        QuestTargetType targetType,
        Long targetId,
        int amount
    ) {
        List<QuestProgressView> syncedQuests = syncQuests(character);

        for (QuestProgressView questView : syncedQuests) {
            if (questView.characterQuest().isTrackable() && questView.quest().matchesTarget(targetType, targetId)) {
                questView.characterQuest().increaseProgress(amount);
            }
        }

        syncQuests(character);
    }

    private List<CharacterQuest> ensureCharacterQuestStates(Long characterId, List<Quest> quests) {
        List<CharacterQuest> existingStates = new ArrayList<>(characterQuestRepository.findByCharacterIdOrderByQuestIdAsc(characterId));
        Map<Long, CharacterQuest> existingByQuestId = existingStates.stream()
            .collect(Collectors.toMap(CharacterQuest::getQuestId, Function.identity()));
        List<CharacterQuest> missingStates = new ArrayList<>();

        for (Quest quest : quests) {
            if (existingByQuestId.containsKey(quest.getId())) {
                continue;
            }

            QuestStatus initialStatus = quest.getPrerequisiteQuestId() == null ? QuestStatus.ACTIVE : QuestStatus.LOCKED;
            CharacterQuest characterQuest = CharacterQuest.create(characterId, quest.getId(), initialStatus);
            missingStates.add(characterQuest);
            existingStates.add(characterQuest);
        }

        if (!missingStates.isEmpty()) {
            characterQuestRepository.saveAllAndFlush(missingStates);
        }

        return existingStates;
    }

    private void syncQuestState(
        Character character,
        Quest quest,
        CharacterQuest characterQuest,
        Map<Long, CharacterQuest> questsById
    ) {
        if (characterQuest.isClaimed()) {
            return;
        }

        if (!isUnlocked(quest, character.getJob(), questsById)) {
            characterQuest.lock();
            return;
        }

        int progressCount = resolveProgressCount(character, quest, characterQuest.getProgressCount());

        if (progressCount >= quest.getRequiredCount()) {
            characterQuest.complete(progressCount);
            return;
        }

        characterQuest.activate(progressCount);
    }

    private boolean isUnlocked(
        Quest quest,
        JobType characterJob,
        Map<Long, CharacterQuest> questsById
    ) {
        if (quest.getJobRestriction() != null && quest.getJobRestriction() != characterJob) {
            return false;
        }

        if (quest.getPrerequisiteQuestId() == null) {
            return true;
        }

        CharacterQuest prerequisiteQuest = questsById.get(quest.getPrerequisiteQuestId());
        return prerequisiteQuest != null && prerequisiteQuest.getStatus() == QuestStatus.CLAIMED;
    }

    private int resolveProgressCount(Character character, Quest quest, int storedProgressCount) {
        return switch (quest.getRequiredTargetType()) {
            case CHARACTER_CREATED -> 1;
            case MAIN_PLAZA_VISIT -> character.getCurrentLocation() == CharacterLocation.MAIN_PLAZA ? 1 : 0;
            case JOB_SELECTED -> character.getJob() == null ? 0 : 1;
            case CLASS_TAKE, MINIGAME_PLAY, SHOPPING_STREET_VISIT, ITEM_PURCHASE -> storedProgressCount;
            case LEVEL_REACHED -> character.getLevel();
        };
    }
}
