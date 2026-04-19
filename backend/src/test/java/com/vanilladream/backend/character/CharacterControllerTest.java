package com.vanilladream.backend.character;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
class CharacterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createCharacterSucceeds() throws Exception {
        String token = signupAndExtractToken("character-create@example.com", "character_create");

        mockMvc.perform(createCharacter(token, "Lina"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.name").value("Lina"))
            .andExpect(jsonPath("$.data.level").value(1))
            .andExpect(jsonPath("$.data.exp").value(0))
            .andExpect(jsonPath("$.data.beads").value(300))
            .andExpect(jsonPath("$.data.promotionTier").value("BEGINNER"))
            .andExpect(jsonPath("$.data.currentLocation").value("MAIN_PLAZA"));
    }

    @Test
    void getMyCharacterSucceeds() throws Exception {
        String token = signupAndExtractToken("character-me@example.com", "character_me");

        mockMvc.perform(createCharacter(token, "Mina"))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/characters/me").header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.name").value("Mina"));
    }

    @Test
    void createSecondCharacterFails() throws Exception {
        String token = signupAndExtractToken("character-second@example.com", "character_second");

        mockMvc.perform(createCharacter(token, "Nina"))
            .andExpect(status().isCreated());

        mockMvc.perform(createCharacter(token, "Nia"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Character already exists"));
    }

    @Test
    void updateAppearanceSucceeds() throws Exception {
        String token = signupAndExtractToken("character-appearance@example.com", "character_appearance");

        mockMvc.perform(createCharacter(token, "Rina"))
            .andExpect(status().isCreated());

        mockMvc.perform(patch("/api/characters/me/appearance")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "skinTone", "TAN",
                    "hairStyle", "WAVY",
                    "hairColor", "PINK",
                    "facePreset", "CHIC"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.skinTone").value("TAN"))
            .andExpect(jsonPath("$.data.hairStyle").value("WAVY"))
            .andExpect(jsonPath("$.data.hairColor").value("PINK"))
            .andExpect(jsonPath("$.data.facePreset").value("CHIC"));
    }

    @Test
    void invalidAppearanceValueFails() throws Exception {
        String token = signupAndExtractToken("character-invalid-appearance@example.com", "invalid_appearance");

        mockMvc.perform(createCharacter(token, "Sina"))
            .andExpect(status().isCreated());

        mockMvc.perform(patch("/api/characters/me/appearance")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "skinTone", "UNKNOWN",
                    "hairStyle", "WAVY",
                    "hairColor", "PINK",
                    "facePreset", "CHIC"
                ))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid request body"));
    }

    @Test
    void selectJobSucceeds() throws Exception {
        String token = signupAndExtractToken("character-job@example.com", "character_job");

        mockMvc.perform(createCharacter(token, "Jina"))
            .andExpect(status().isCreated());

        mockMvc.perform(selectJob(token, "DESIGNER"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.job").value("DESIGNER"))
            .andExpect(jsonPath("$.data.stats.length()").value(3))
            .andExpect(jsonPath("$.data.stats[0].statType").value("CREATIVITY"))
            .andExpect(jsonPath("$.data.stats[0].value").value(0));
    }

    @Test
    void selectJobFailsWhenAlreadySelected() throws Exception {
        String token = signupAndExtractToken("character-job-again@example.com", "character_job_again");

        mockMvc.perform(createCharacter(token, "Ari"))
            .andExpect(status().isCreated());
        mockMvc.perform(selectJob(token, "MD"))
            .andExpect(status().isOk());

        mockMvc.perform(selectJob(token, "MODEL"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Job is already selected"));
    }

    private String signupAndExtractToken(String email, String username) throws Exception {
        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", email,
                    "username", username,
                    "password", "password123"
                ))))
            .andExpect(status().isCreated())
            .andReturn();

        JsonNode root = objectMapper.readTree(signupResult.getResponse().getContentAsString());
        return root.path("data").path("accessToken").asText();
    }

    private org.springframework.test.web.servlet.RequestBuilder createCharacter(
        String token,
        String name
    ) throws Exception {
        return post("/api/characters")
            .header(HttpHeaders.AUTHORIZATION, bearer(token))
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "name", name,
                "skinTone", "LIGHT",
                "hairStyle", "BOB",
                "hairColor", "BROWN",
                "facePreset", "SOFT"
            )));
    }

    private org.springframework.test.web.servlet.RequestBuilder selectJob(
        String token,
        String job
    ) throws Exception {
        return post("/api/characters/me/job")
            .header(HttpHeaders.AUTHORIZATION, bearer(token))
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of("job", job)));
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
