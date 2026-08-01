package com.bookapp.repository;

import com.bookapp.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Book> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT DISTINCT b.category FROM Book b WHERE b.user.id = :userId AND b.category IS NOT NULL AND b.category <> '' ORDER BY b.category")
    List<String> findDistinctCategories(@Param("userId") Long userId);

    @Query("SELECT DISTINCT b.status FROM Book b WHERE b.user.id = :userId AND b.status IS NOT NULL AND b.status <> '' ORDER BY b.status")
    List<String> findDistinctStatuses(@Param("userId") Long userId);

    @Query("""
            SELECT b FROM Book b
            WHERE b.user.id = :userId
              AND (:category IS NULL OR :category = '' OR b.category = :category)
              AND (:status IS NULL OR :status = '' OR b.status = :status)
              AND (:keyword IS NULL OR :keyword = ''
                   OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY b.createdAt DESC
            """)
    List<Book> search(@Param("userId") Long userId,
                      @Param("category") String category,
                      @Param("status") String status,
                      @Param("keyword") String keyword);
}
