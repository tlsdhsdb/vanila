package com.vanilladream.backend.quest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterQuestRepository extends JpaRepository<CharacterQuest, Long> {

    List<CharacterQuest> findByCharacterIdOrderByQuestIdAsc(Long characterId);
}
