package com.vanilladream.backend.character;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

import com.vanilladream.backend.common.exception.ApiException;
import com.vanilladream.backend.quest.QuestProgressService;

class CharacterServiceTest {

    @Test
    void selectJobMapsDuplicateStatConflict() {
        CharacterRepository characterRepository = mock(CharacterRepository.class);
        CharacterStatRepository characterStatRepository = mock(CharacterStatRepository.class);
        QuestProgressService questProgressService = mock(QuestProgressService.class);
        CharacterService characterService = new CharacterService(
            characterRepository,
            characterStatRepository,
            questProgressService
        );
        Character character = Character.create(
            1L,
            "Lina",
            SkinTone.LIGHT,
            HairStyle.BOB,
            HairColor.BROWN,
            FacePreset.SOFT
        );

        when(characterRepository.findByAccountId(1L)).thenReturn(Optional.of(character));
        when(characterRepository.saveAndFlush(character)).thenReturn(character);
        when(characterStatRepository.saveAllAndFlush(any()))
            .thenThrow(new DataIntegrityViolationException("duplicate character stat"));

        assertThatThrownBy(() -> characterService.selectJob(1L, JobType.DESIGNER))
            .isInstanceOfSatisfying(ApiException.class, exception -> {
                assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                assertThat(exception.getMessage()).isEqualTo("Job is already selected");
            });
    }
}
