package com.vanilladream.backend.quest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterRepository;
import com.vanilladream.backend.character.CharacterStatRepository;
import com.vanilladream.backend.character.dto.CharacterResponse;
import com.vanilladream.backend.common.exception.ApiException;
import com.vanilladream.backend.quest.dto.ClaimQuestResponse;
import com.vanilladream.backend.quest.dto.QuestProgressOverviewResponse;
import com.vanilladream.backend.quest.dto.QuestResponse;

@Service
@Transactional(readOnly = true)
public class QuestService {

    private final CharacterRepository characterRepository;
    private final CharacterStatRepository characterStatRepository;
    private final QuestProgressService questProgressService;

    public QuestService(
        CharacterRepository characterRepository,
        CharacterStatRepository characterStatRepository,
        QuestProgressService questProgressService
    ) {
        this.characterRepository = characterRepository;
        this.characterStatRepository = characterStatRepository;
        this.questProgressService = questProgressService;
    }

    public List<QuestResponse> getQuests(Long accountId) {
        Character character = findCharacter(accountId);
        return questProgressService.syncQuests(character)
            .stream()
            .map(questView -> QuestResponse.from(questView.quest(), questView.characterQuest()))
            .toList();
    }

    public List<QuestResponse> getActiveQuests(Long accountId) {
        return getQuests(accountId).stream()
            .filter(quest -> quest.status() == QuestStatus.ACTIVE || quest.status() == QuestStatus.COMPLETED)
            .toList();
    }

    public QuestProgressOverviewResponse getProgress(Long accountId) {
        Character character = findCharacter(accountId);
        return QuestProgressOverviewResponse.from(character, getQuests(accountId));
    }

    @Transactional
    public ClaimQuestResponse claimQuest(Long accountId, Long questId) {
        Character character = findCharacter(accountId);
        QuestProgressView questView = questProgressService.syncQuests(character)
            .stream()
            .filter(candidate -> candidate.quest().getId().equals(questId))
            .findFirst()
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Quest was not found"));

        if (questView.characterQuest().getStatus() == QuestStatus.CLAIMED) {
            throw new ApiException(HttpStatus.CONFLICT, "Quest reward is already claimed");
        }

        if (questView.characterQuest().getStatus() != QuestStatus.COMPLETED) {
            throw new ApiException(HttpStatus.CONFLICT, "Quest is not completed yet");
        }

        character.addBeads(questView.quest().getRewardBeads());
        character.gainExp(questView.quest().getRewardExp());

        if (questView.quest().getRewardTitle() != null && !questView.quest().getRewardTitle().isBlank()) {
            character.updateTitle(questView.quest().getRewardTitle());
        }

        questView.characterQuest().claim();
        characterRepository.saveAndFlush(character);
        questProgressService.syncQuests(character);

        return new ClaimQuestResponse(
            QuestResponse.from(questView.quest(), questView.characterQuest()),
            questView.quest().getRewardBeads(),
            questView.quest().getRewardExp(),
            questView.quest().getRewardTitle(),
            CharacterResponse.from(character, characterStatRepository.findByCharacterIdOrderByStatTypeAsc(character.getId()))
        );
    }

    private Character findCharacter(Long accountId) {
        return characterRepository.findByAccountId(accountId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Character has not been created"));
    }
}
