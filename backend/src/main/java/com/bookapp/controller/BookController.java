package com.bookapp.controller;

import com.bookapp.dto.BookRequest;
import com.bookapp.dto.BookResponse;
import com.bookapp.exception.ResourceNotFoundException;
import com.bookapp.repository.UserRepository;
import com.bookapp.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final UserRepository userRepository;

    public BookController(BookService bookService, UserRepository userRepository) {
        this.bookService = bookService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAll(Authentication authentication,
                                                     @RequestParam(required = false) String category,
                                                     @RequestParam(required = false) String status,
                                                     @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(bookService.getAll(currentUserId(authentication), category, status, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getById(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(bookService.getById(currentUserId(authentication), id));
    }

    @PostMapping
    public ResponseEntity<BookResponse> create(Authentication authentication,
                                               @Valid @RequestBody BookRequest request) {
        BookResponse created = bookService.create(currentUserId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> update(Authentication authentication,
                                               @PathVariable Long id,
                                               @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.update(currentUserId(authentication), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        bookService.delete(currentUserId(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meta/categories")
    public ResponseEntity<List<String>> getCategories(Authentication authentication) {
        return ResponseEntity.ok(bookService.getCategories(currentUserId(authentication)));
    }

    @GetMapping("/meta/statuses")
    public ResponseEntity<List<String>> getStatuses(Authentication authentication) {
        return ResponseEntity.ok(bookService.getStatuses(currentUserId(authentication)));
    }

    private Long currentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"))
                .getId();
    }
}
