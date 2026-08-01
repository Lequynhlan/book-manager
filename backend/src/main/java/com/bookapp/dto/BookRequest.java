package com.bookapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class BookRequest {

    @NotBlank(message = "Tiêu đề sách không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    private String title;

    @Size(max = 200, message = "Tác giả tối đa 200 ký tự")
    private String author;

    @Size(max = 20, message = "Thể loại tối đa 20 ký tự")
    private String category;

    @Size(max = 50, message = "Trạng thái tối đa 50 ký tự")
    private String status;

    @Min(value = 0, message = "Đánh giá tối thiểu là 0")
    @Max(value = 5, message = "Đánh giá tối đa là 5")
    private Integer rating;

    @Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
    private String description;

    @Size(max = 500, message = "Ảnh bìa URL tối đa 500 ký tự")
    private String coverUrl;

    @Size(max = 500, message = "Link tối đa 500 ký tự")
    private String link;

    private LocalDate startedDate;

    private LocalDate finishedDate;

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
}
