package com.bookapp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 200)
    private String author;

    @Column(length = 20)
    private String category;

    @Column(length = 50)
    private String status;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 2000)
    private String description;

    @Column(length = 500)
    private String coverUrl;

    @Column(length = 500)
    private String link;

    private LocalDate startedDate;

    private LocalDate finishedDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public LocalDate getStartedDate() { return startedDate; }
    public void setStartedDate(LocalDate startedDate) { this.startedDate = startedDate; }

    public LocalDate getFinishedDate() { return finishedDate; }
    public void setFinishedDate(LocalDate finishedDate) { this.finishedDate = finishedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
