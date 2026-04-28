package com.vanilladream.backend.jobclass;

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
import com.vanilladream.backend.character.Character;
import com.vanilladream.backend.character.CharacterRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JobClassControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CharacterRepository characterRepository;

    @Test
    void takeClassSucceedsAndLevelsUp() throws Exception {
        AuthSession authSession = signupCharacterAndSelectJob("class-success@example.com", "class_success", "DESIGNER");
        String token = authSession.token();
        long classId = getFirstClassId(token);

        MvcResult result = mockMvc.perform(post("/api/classes/{classId}/take", classId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.spentBeads").value(60))
            .andExpect(jsonPath("$.data.rewardExp").value(120))
            .andExpect(jsonPath("$.data.previousLevel").value(1))
            .andExpect(jsonPath("$.data.currentLevel").value(2))
            .andExpect(jsonPath("$.data.leveledUp").value(true))
            .andExpect(jsonPath("$.data.character.beads").value(240))
            .andExpect(jsonPath("$.data.character.exp").value(120))
            .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        JsonNode stats = root.path("data").path("character").path("stats");
        int creativityValue = 0;

        for (JsonNode stat : stats) {
            if ("CREATIVITY".equals(stat.path("statType").asText())) {
                creativityValue = stat.path("value").asInt();
            }
        }

        org.assertj.core.api.Assertions.assertThat(creativityValue).isEqualTo(2);
    }

    @Test
    void takeClassFailsWhenBeadsAreInsufficient() throws Exception {
        AuthSession authSession = signupCharacterAndSelectJob("class-fail@example.com", "class_fail", "DESIGNER");
        String token = authSession.token();
        long classId = getFirstClassId(token);
        Character character = characterRepository.findByAccountId(authSession.accountId())
            .orElseThrow();

        character.spendBeads(250);
        characterRepository.saveAndFlush(character);

        mockMvc.perform(post("/api/classes/{classId}/take", classId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Not enough Beads to take this class"));
    }

    private AuthSession signupCharacterAndSelectJob(String email, String username, String job) throws Exception {
        AuthSession authSession = signup(email, username);
        String token = authSession.token();

        mockMvc.perform(createCharacter(token, "Lina"))
            .andExpect(status().isCreated());

        mockMvc.perform(selectJob(token, job))
            .andExpect(status().isOk());

        return authSession;
    }

    private long getFirstClassId(String token) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/classes")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").get(0).path("id").asLong();
    }

    private AuthSession signup(String email, String username) throws Exception {
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
        return new AuthSession(
            root.path("data").path("accessToken").asText(),
            root.path("data").path("account").path("id").asLong()
        );
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

    private record AuthSession(String token, Long accountId) {
    }
}
