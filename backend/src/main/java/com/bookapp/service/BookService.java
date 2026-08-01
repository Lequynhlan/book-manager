package com.bookapp.service;

import com.bookapp.dto.BookRequest;
import com.bookapp.dto.BookResponse;
import com.bookapp.entity.Book;
import com.bookapp.entity.User;
import com.bookapp.exception.ResourceNotFoundException;
import com.bookapp.repository.BookRepository;
import com.bookapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookResponse create(Long userId, BookRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Book book = new Book();
        applyRequest(book, request);
        book.setUser(user);
        return toResponse(bookRepository.save(book));
    }

    public List<BookResponse> getAll(Long userId, String category, String status, String keyword) {
        return bookRepository.search(userId, category, status, keyword)
                .stream().map(this::toResponse).toList();
    }

    public BookResponse getById(Long userId, Long bookId) {
        Book book = findOwned(userId, bookId);
        return toResponse(book);
    }

    @Transactional
    public BookResponse update(Long userId, Long bookId, BookRequest request) {
        Book book = findOwned(userId, bookId);
        applyRequest(book, request);
        return toResponse(bookRepository.save(book));
    }

    @Transactional
    public void delete(Long userId, Long bookId) {
        Book book = findOwned(userId, bookId);
        bookRepository.delete(book);
    }

    public List<String> getCategories(Long userId) {
        return bookRepository.findDistinctCategories(userId);
    }

    public List<String> getStatuses(Long userId) {
        return bookRepository.findDistinctStatuses(userId);
    }

    private Book findOwned(Long userId, Long bookId) {
        return bookRepository.findByIdAndUserId(bookId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với id = " + bookId));
    }

    private void applyRequest(Book book, BookRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setStatus(request.getStatus());
        book.setRating(request.getRating() == null ? 0 : request.getRating());
        book.setDescription(request.getDescription());
        book.setCoverUrl(request.getCoverUrl());
        book.setLink(request.getLink());
        book.setStartedDate(request.getStartedDate());
        book.setFinishedDate(request.getFinishedDate());
    }

    private BookResponse toResponse(Book book) {
        return new BookResponse(
                book.getId(), book.getTitle(), book.getAuthor(), book.getCategory(),
                book.getStatus(), book.getRating(), book.getDescription(), book.getCoverUrl(),
                book.getLink(), book.getStartedDate(), book.getFinishedDate(), book.getCreatedAt());
    }
}
