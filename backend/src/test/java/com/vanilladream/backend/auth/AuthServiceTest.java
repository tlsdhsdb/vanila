package com.vanilladream.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vanilladream.backend.auth.dto.SignupRequest;
import com.vanilladream.backend.auth.security.JwtTokenProvider;
import com.vanilladream.backend.common.exception.ApiException;

class AuthServiceTest {

    @Test
    void signupMapsDatabaseDuplicateConflict() {
        AccountRepository accountRepository = mock(AccountRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtTokenProvider jwtTokenProvider = mock(JwtTokenProvider.class);
        AuthService authService = new AuthService(accountRepository, passwordEncoder, jwtTokenProvider);
        SignupRequest request = new SignupRequest("race@example.com", "race_user", "password123");

        when(accountRepository.existsByEmail("race@example.com")).thenReturn(false);
        when(accountRepository.existsByUsername("race_user")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(accountRepository.saveAndFlush(any(Account.class)))
            .thenThrow(new DataIntegrityViolationException("unique account conflict"));

        assertThatThrownBy(() -> authService.signup(request))
            .isInstanceOfSatisfying(ApiException.class, exception -> {
                assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                assertThat(exception.getMessage()).isEqualTo("Email or username is already in use");
            });
    }
}
