package com.vanilladream.backend.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void signupSucceeds() throws Exception {
        mockMvc.perform(signup("signup-success@example.com", "signup_success"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.accessToken").isString())
            .andExpect(jsonPath("$.data.account.email").value("signup-success@example.com"));
    }

    @Test
    void signupFailsWhenEmailIsDuplicate() throws Exception {
        mockMvc.perform(signup("duplicate-email@example.com", "duplicate_email_one"))
            .andExpect(status().isCreated());

        mockMvc.perform(signup("duplicate-email@example.com", "duplicate_email_two"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Email is already in use"));
    }

    @Test
    void signupFailsWhenUsernameIsDuplicate() throws Exception {
        mockMvc.perform(signup("duplicate-username-one@example.com", "duplicate_username"))
            .andExpect(status().isCreated());

        mockMvc.perform(signup("duplicate-username-two@example.com", "duplicate_username"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Username is already in use"));
    }

    @Test
    void loginSucceeds() throws Exception {
        mockMvc.perform(signup("login-success@example.com", "login_success"))
            .andExpect(status().isCreated());

        mockMvc.perform(login("login-success@example.com", "password123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.accessToken").isString());
    }

    @Test
    void loginFailsWithWrongPassword() throws Exception {
        mockMvc.perform(signup("login-fail@example.com", "login_fail"))
            .andExpect(status().isCreated());

        mockMvc.perform(login("login-fail@example.com", "wrong-password"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void meSucceedsWithBearerToken() throws Exception {
        MvcResult signupResult = mockMvc.perform(signup("me-success@example.com", "me_success"))
            .andExpect(status().isCreated())
            .andReturn();

        String token = extractAccessToken(signupResult);

        mockMvc.perform(get("/api/auth/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.email").value("me-success@example.com"));
    }

    @Test
    void meFailsWithoutBearerToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Authentication is required"));
    }

    private org.springframework.test.web.servlet.RequestBuilder signup(String email, String username) throws Exception {
        return post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "email", email,
                "username", username,
                "password", "password123"
            )));
    }

    private org.springframework.test.web.servlet.RequestBuilder login(String email, String password) throws Exception {
        return post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", password
            )));
    }

    private String extractAccessToken(MvcResult result) throws Exception {
        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").path("accessToken").asText();
    }
}
