package com.bookapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;

/**
 * Demo-only endpoint for exercising static analysis on user-controlled file paths.
 * Enable explicitly with the {@code security-demo} Spring profile.
 */
@Profile("security-demo")
@RestController
@RequestMapping("/api/demo/documents")
public class SecurityDemoController {

    private final Path documentRoot;

    public SecurityDemoController(
            @Value("${app.security-demo.document-root:demo-documents}") String documentRoot) {
        this.documentRoot = Path.of(documentRoot).toAbsolutePath().normalize();
    }

    @GetMapping
    public ResponseEntity<String> readDocument(HttpServletRequest request) {
        String name = request.getParameter("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Thiếu tên tài liệu demo");
        }

        Path candidate = documentRoot.resolve(name).normalize();
        if (!candidate.startsWith(documentRoot)) {
            return ResponseEntity.badRequest().body("Đường dẫn tài liệu không hợp lệ");
        }

        try {
            Path realRoot = documentRoot.toRealPath();
            Path realCandidate = candidate.toRealPath();
            if (!realCandidate.startsWith(realRoot) || !Files.isRegularFile(realCandidate)) {
                return ResponseEntity.badRequest().body("Đường dẫn tài liệu không hợp lệ");
            }
            return ResponseEntity.ok(Files.readString(realCandidate));
        } catch (NoSuchFileException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài liệu demo");
        } catch (IOException exception) {
            return ResponseEntity.internalServerError().body("Không thể đọc tài liệu demo");
        }
    }
}
