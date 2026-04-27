package com.vanilladream.backend.character;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanilladream.backend.character.dto.AppearanceUpdateRequest;
import com.vanilladream.backend.character.dto.CharacterCreateRequest;
import com.vanilladream.backend.character.dto.CharacterResponse;
import com.vanilladream.backend.common.exception.ApiException;

@Service
@Transactional(readOnly = true)
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final CharacterStatRepository characterStatRepository;

    public CharacterService(
        CharacterRepository characterRepository,
        CharacterStatRepository characterStatRepository
    ) {
        this.characterRepository = characterRepository;
        this.characterStatRepository = characterStatRepository;
    }

    @Transactional
    public CharacterResponse createCharacter(Long accountId, CharacterCreateRequest request) {
        if (characterRepository.existsByAccountId(accountId)) {
            throw new ApiException(HttpStatus.CONFLICT, "Character already exists");
        }

        Character character = Character.create(
            accountId,
            request.name().trim(),
            request.skinTone(),
            request.hairStyle(),
            request.hairColor(),
            request.facePreset()
        );
        Character savedCharacter;
        try {
            savedCharacter = characterRepository.saveAndFlush(character);
        } catch (DataIntegrityViolationException exception) {
            throw new ApiException(HttpStatus.CONFLICT, "Character already exists");
        }

        return CharacterResponse.from(savedCharacter, List.of());
    }

    public CharacterResponse getMyCharacter(Long accountId) {
        Character character = findMyCharacter(accountId);
        return CharacterResponse.from(character, findStats(character));
    }

    @Transactional
    public CharacterResponse updateAppearance(Long accountId, AppearanceUpdateRequest request) {
        Character character = findMyCharacter(accountId);
        character.updateAppearance(
            request.skinTone(),
            request.hairStyle(),
            request.hairColor(),
            request.facePreset()
        );

        return CharacterResponse.from(character, findStats(character));
    }

    @Transactional
    public CharacterResponse selectJob(Long accountId, JobType job) {
        Character character = findMyCharacter(accountId);

        if (character.getJob() != null) {
            throw new ApiException(HttpStatus.CONFLICT, "Job is already selected");
        }

        character.selectJob(job);
        Character savedCharacter = characterRepository.saveAndFlush(character);
        List<CharacterStat> stats = job.getStatTypes()
            .stream()
            .map(statType -> CharacterStat.createStartingStat(savedCharacter.getId(), statType))
            .toList();
        List<CharacterStat> savedStats;
        try {
            savedStats = characterStatRepository.saveAllAndFlush(stats);
        } catch (DataIntegrityViolationException exception) {
            throw new ApiException(HttpStatus.CONFLICT, "Job is already selected");
        }

        return CharacterResponse.from(savedCharacter, savedStats);
    }

    private Character findMyCharacter(Long accountId) {
        return characterRepository.findByAccountId(accountId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Character has not been created"));
    }

    private List<CharacterStat> findStats(Character character) {
        return characterStatRepository.findByCharacterIdOrderByStatTypeAsc(character.getId());
    }
}
