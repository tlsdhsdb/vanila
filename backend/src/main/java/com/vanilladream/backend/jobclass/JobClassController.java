package com.vanilladream.backend.jobclass;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vanilladream.backend.common.api.ApiResponse;
import com.vanilladream.backend.jobclass.dto.JobClassResponse;
import com.vanilladream.backend.jobclass.dto.TakeJobClassResponse;

@RestController
@RequestMapping("/api/classes")
public class JobClassController {

    private final JobClassService jobClassService;

    public JobClassController(JobClassService jobClassService) {
        this.jobClassService = jobClassService;
    }

    @GetMapping
    public ApiResponse<List<JobClassResponse>> getClasses(Authentication authentication) {
        return ApiResponse.success(jobClassService.getClasses(getAccountId(authentication)));
    }

    @PostMapping("/{classId}/take")
    public ApiResponse<TakeJobClassResponse> takeClass(
        Authentication authentication,
        @PathVariable Long classId
    ) {
        return ApiResponse.success(jobClassService.takeClass(getAccountId(authentication), classId));
    }

    private Long getAccountId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
