package com.vanilladream.backend.quest;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vanilladream.backend.common.api.ApiResponse;
import com.vanilladream.backend.quest.dto.ClaimQuestResponse;
import com.vanilladream.backend.quest.dto.QuestProgressOverviewResponse;
import com.vanilladream.backend.quest.dto.QuestResponse;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public ApiResponse<List<QuestResponse>> getQuests(Authentication authentication) {
        return ApiResponse.success(questService.getQuests(getAccountId(authentication)));
    }

    @GetMapping("/active")
    public ApiResponse<List<QuestResponse>> getActiveQuests(Authentication authentication) {
        return ApiResponse.success(questService.getActiveQuests(getAccountId(authentication)));
    }

    @GetMapping("/progress")
    public ApiResponse<QuestProgressOverviewResponse> getQuestProgress(Authentication authentication) {
        return ApiResponse.success(questService.getProgress(getAccountId(authentication)));
    }

    @PostMapping("/{questId}/claim")
    public ApiResponse<ClaimQuestResponse> claimQuest(
        Authentication authentication,
        @PathVariable Long questId
    ) {
        return ApiResponse.success(questService.claimQuest(getAccountId(authentication), questId));
    }

    private Long getAccountId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
