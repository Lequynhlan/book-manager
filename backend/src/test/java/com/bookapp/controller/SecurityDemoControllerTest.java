package com.bookapp.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.context.annotation.Profile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SecurityDemoControllerTest {

    @TempDir
    Path documentRoot;

    @Test
    void servesDocumentsWithinTheDemoDirectory() throws Exception {
        Files.writeString(documentRoot.resolve("guide.txt"), "Demo guide");
        MockMvc mvc = MockMvcBuilders.standaloneSetup(
                new SecurityDemoController(documentRoot.toString())).build();

        mvc.perform(get("/api/demo/documents").param("name", "guide.txt"))
                .andExpect(status().isOk())
                .andExpect(content().string("Demo guide"));
    }

    @Test
    void rejectsTraversalOutsideTheDemoDirectory() throws Exception {
        Path outside = documentRoot.getParent().resolve("outside.txt");
        Files.writeString(outside, "must not be returned");
        MockMvc mvc = MockMvcBuilders.standaloneSetup(
                new SecurityDemoController(documentRoot.toString())).build();

        mvc.perform(get("/api/demo/documents").param("name", "../outside.txt"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void endpointIsOnlyEnabledWithTheExplicitSecurityDemoProfile() {
        Profile profile = SecurityDemoController.class.getAnnotation(Profile.class);

        assertArrayEquals(new String[]{"security-demo"}, profile.value());
    }
}
