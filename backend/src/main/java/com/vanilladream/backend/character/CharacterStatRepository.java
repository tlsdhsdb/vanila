package com.vanilladream.backend.character;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterStatRepository extends JpaRepository<CharacterStat, Long> {

    List<CharacterStat> findByCharacterIdOrderByStatTypeAsc(Long characterId);
}
