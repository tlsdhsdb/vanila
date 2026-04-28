package com.vanilladream.backend.quest;

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
class QuestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void autoCompletedQuestCanBeClaimedOnce() throws Exception {
        String token = signupAndExtractToken("quest-claim@example.com", "quest_claim");

        mockMvc.perform(createCharacter(token, "Lina"))
            .andExpect(status().isCreated());

        long questId = getFirstActiveQuestId(token);

        mockMvc.perform(post("/api/quests/{questId}/claim", questId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.rewardBeads").value(50))
            .andExpect(jsonPath("$.data.rewardExp").value(20))
            .andExpect(jsonPath("$.data.quest.status").value("CLAIMED"))
            .andExpect(jsonPath("$.data.character.beads").value(350))
            .andExpect(jsonPath("$.data.character.exp").value(20));

        mockMvc.perform(post("/api/quests/{questId}/claim", questId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Quest reward is already claimed"));
    }

    @Test
    void progressOverviewReflectsClaimedQuestState() throws Exception {
        String token = signupAndExtractToken("quest-progress@example.com", "quest_progress");

        mockMvc.perform(createCharacter(token, "Nari"))
            .andExpect(status().isCreated());

        long questId = getFirstActiveQuestId(token);

        mockMvc.perform(post("/api/quests/{questId}/claim", questId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/quests/progress")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.claimedCount").value(1))
            .andExpect(jsonPath("$.data.currentLevel").value(1))
            .andExpect(jsonPath("$.data.currentExp").value(20));
    }

    @Test
    void questEndpointsAreAvailableBeforeTakingFirstClass() throws Exception {
        String token = signupAndExtractToken("quest-before-class@example.com", "quest_before_class");

        mockMvc.perform(createCharacter(token, "Mina"))
            .andExpect(status().isCreated());

        mockMvc.perform(selectJob(token, "DESIGNER"))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/quests")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/quests/active")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/quests/progress")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk());
    }

    private long getFirstActiveQuestId(String token) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/quests/active")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].title").value("새 방, 새로운 시작"))
            .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").get(0).path("id").asLong();
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
