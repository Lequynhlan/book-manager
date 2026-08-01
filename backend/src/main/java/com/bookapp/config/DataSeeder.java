package com.bookapp.config;

import com.bookapp.entity.Book;
import com.bookapp.entity.User;
import com.bookapp.repository.BookRepository;
import com.bookapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

/**
 * Seeds demo users and sample books on first startup (idempotent).
 * Demo accounts for the teacher:
 *   - demo / demo123   (Demo User)
 *   - teacher / demo123 (Teacher Account)
 */
@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository,
                                      BookRepository bookRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return; // already seeded
            }

            log.info("=== DataSeeder: creating demo users ===");

            User demo = new User();
            demo.setUsername("demo");
            demo.setEmail("demo@bookapp.com");
            demo.setFullName("Demo User");
            demo.setPassword(passwordEncoder.encode("demo123"));
            userRepository.save(demo);

            User teacher = new User();
            teacher.setUsername("teacher");
            teacher.setEmail("teacher@bookapp.com");
            teacher.setFullName("Teacher Account");
            teacher.setPassword(passwordEncoder.encode("demo123"));
            userRepository.save(teacher);

            log.info("=== DataSeeder: creating sample books for 'demo' ===");

            createBook(bookRepository, demo,
                    "Dế Mèn Phiêu Lưu Ký", "Tô Hoài", "Văn học thiếu nhi", "DA_DOC", 5,
                    "Một tác phẩm kinh điển của văn học Việt Nam kể về chuyến phiêu lưu của chú Dế Mèn.",
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/De_Men_Phieu_Luu_Ky.jpg/220px-De_Men_Phiêu_Luu_Ky.jpg".replace("Phiêu", "Phieu"),
                    "https://vi.wikipedia.org/wiki/D%E1%BA%BF_M%C3%A8n_phi%C3%AAu_l%C6%B0u_k%C3%BD",
                    LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 20));

            createBook(bookRepository, demo,
                    "Nhà Giả Kim", "Paulo Coelho", "Tiểu thuyết", "DANG_DOC", 4,
                    "Cuốn sách truyền cảm hứng về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Alchemist.jpg/220px-Alchemist.jpg",
                    "https://vi.wikipedia.org/wiki/Nh%C3%A0_gi%E1%BA%A3_kim",
                    LocalDate.of(2026, 7, 5), null);

            createBook(bookRepository, demo,
                    "Clean Code", "Robert C. Martin", "Lập trình", "DANG_DOC", 5,
                    "Cẩm nang viết code sạch, dễ đọc, dễ bảo trì cho mọi lập trình viên.",
                    "https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg",
                    "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
                    LocalDate.of(2026, 7, 10), null);

            createBook(bookRepository, demo,
                    "Sapiens: Lược Sử Loài Người", "Yuval Noah Harari", "Khoa học xã hội", "MUON_DOC", 0,
                    "Lịch sử loài người từ thời săn bắn hái lượm đến thời đại công nghệ.",
                    null,
                    "https://vi.wikipedia.org/wiki/Sapiens:_L%C6%B0%E1%BB%A3c_s%E1%BB%AD_lo%C3%A0i_ng%C6%B0%E1%BB%9Di",
                    null, null);

            log.info("=== DataSeeder: done ===");
        };
    }

    private void createBook(BookRepository bookRepository, User user,
                            String title, String author, String category, String status, int rating,
                            String description, String coverUrl, String link,
                            LocalDate startedDate, LocalDate finishedDate) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setStatus(status);
        book.setRating(rating);
        book.setDescription(description);
        book.setCoverUrl(coverUrl);
        book.setLink(link);
        book.setStartedDate(startedDate);
        book.setFinishedDate(finishedDate);
        book.setUser(user);
        bookRepository.save(book);
    }
}
