package com.vanilladream.backend.character;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.vanilladream.backend.character.dto.AppearanceUpdateRequest;
import com.vanilladream.backend.character.dto.CharacterCreateRequest;
import com.vanilladream.backend.character.dto.CharacterResponse;
import com.vanilladream.backend.character.dto.JobSelectionRequest;
import com.vanilladream.backend.common.api.ApiResponse;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CharacterResponse> createCharacter(
        Authentication authentication,
        @Valid @RequestBody CharacterCreateRequest request
    ) {
        return ApiResponse.success(characterService.createCharacter(getAccountId(authentication), request));
    }

    @GetMapping("/me")
    public ApiResponse<CharacterResponse> getMyCharacter(Authentication authentication) {
        return ApiResponse.success(characterService.getMyCharacter(getAccountId(authentication)));
    }

    @PatchMapping("/me/appearance")
    public ApiResponse<CharacterResponse> updateAppearance(
        Authentication authentication,
        @Valid @RequestBody AppearanceUpdateRequest request
    ) {
        return ApiResponse.success(characterService.updateAppearance(getAccountId(authentication), request));
    }

    @PostMapping("/me/job")
    public ApiResponse<CharacterResponse> selectJob(
        Authentication authentication,
        @Valid @RequestBody JobSelectionRequest request
    ) {
        return ApiResponse.success(characterService.selectJob(getAccountId(authentication), request.job()));
    }

    private Long getAccountId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
