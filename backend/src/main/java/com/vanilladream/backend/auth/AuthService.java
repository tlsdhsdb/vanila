package com.vanilladream.backend.auth;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanilladream.backend.auth.dto.AccountResponse;
import com.vanilladream.backend.auth.dto.AuthResponse;
import com.vanilladream.backend.auth.dto.LoginRequest;
import com.vanilladream.backend.auth.dto.SignupRequest;
import com.vanilladream.backend.auth.security.JwtTokenProvider;
import com.vanilladream.backend.common.exception.ApiException;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
        AccountRepository accountRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider
    ) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = normalizeEmail(request.email());
        String username = request.username().trim();

        if (accountRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already in use");
        }

        if (accountRepository.existsByUsername(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username is already in use");
        }

        Account account = Account.createUser(
            email,
            username,
            passwordEncoder.encode(request.password())
        );

        Account savedAccount = accountRepository.save(account);
        return createAuthResponse(savedAccount);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        Account account = accountRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), account.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return createAuthResponse(account);
    }

    public AccountResponse getMe(Long accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Account no longer exists"));

        return AccountResponse.from(account);
    }

    private AuthResponse createAuthResponse(Account account) {
        return new AuthResponse(
            "Bearer",
            jwtTokenProvider.createToken(account),
            AccountResponse.from(account)
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

