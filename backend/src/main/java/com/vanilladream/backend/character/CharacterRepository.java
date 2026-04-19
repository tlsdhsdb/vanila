package com.vanilladream.backend.character;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterRepository extends JpaRepository<Character, Long> {

    boolean existsByAccountId(Long accountId);

    Optional<Character> findByAccountId(Long accountId);
}
