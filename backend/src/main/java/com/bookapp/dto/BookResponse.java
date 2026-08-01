package com.bookapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookResponse(
        Long id,
        String title,
        String author,
        String category,
        String status,
        Integer rating,
        String description,
        String coverUrl,
        String link,
        LocalDate startedDate,
        LocalDate finishedDate,
        LocalDateTime createdAt
) {}
