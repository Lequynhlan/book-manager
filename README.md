# Bookmark Manager — Book-App

**Bookmark Manager** — Đồ án cuối kỳ môn **IT4409 (Công nghệ Web)**.

Ứng dụng quản lý sách cá nhân (Bookmark Manager): lưu trữ, phân loại, đánh giá và theo dõi trạng thái đọc của các cuốn sách.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Spring Boot 3 (Java 21) + Spring Security + JWT + Spring Data JPA |
| Cơ sở dữ liệu | PostgreSQL (database: `bookdb`) |
| Frontend | Angular 21 (standalone components) |
| Build backend | Maven (`pom.xml`, spring-boot-maven-plugin) |
| Build frontend | npm / Angular CLI |

## Cấu trúc thư mục

```
book-app/
├── backend/                # Spring Boot backend (port 8080)
│   ├── pom.xml
│   ├── src/main/java/com/bookapp/BookAppApplication.java
│   ├── src/main/resources/application.yml
│   └── scripts/            # Script phụ trợ (seed dữ liệu demo...)
└── frontend/               # Angular frontend (port 4200)
    ├── package.json
    ├── angular.json
    └── src/app/            # Components, services
```

## Yêu cầu môi trường

- **Java 21** trở lên (JDK đang dùng: `C:\Users\DELL\.jdks\openjdk-25.0.2`)
- **Maven** (hoặc dùng IDE IntelliJ IDEA / Spring Tool Suite có tích hợp)
- **Node.js 20+** và **npm** (đã dùng `npm@11.9.0`)
- **PostgreSQL** (bản 14+)

---

## 1. Chạy Backend

### Bước 1 — Tạo cơ sở dữ liệu

Mở **pgAdmin** hoặc **psql** và chạy:

```sql
CREATE DATABASE bookdb;
```

Cấu hình kết nối DB nằm trong `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/bookdb}
    username: ${DB_USERNAME:bookapp}
    password: ${DB_PASSWORD:bookapp123}
```

> Nếu tài khoản PostgreSQL của bạn khác (ví dụ user `postgres`), hãy sửa `username` và `password` cho khớp. Các bảng sẽ được Hibernate tự động tạo (`ddl-auto: update`), không cần chạy migration.

Khi triển khai, nên truyền `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` và `JWT_EXPIRATION_MS` qua biến môi trường. Không dùng giá trị JWT mặc định của môi trường local cho production.

### Bước 2 — Chạy ứng dụng

**Cách 1: Chạy bằng Maven (command line)**

```bash
cd backend
mvn spring-boot:run
```

> Trên Windows nếu gặp lỗi về phiên bản Java, hãy trỏ đúng JDK trước khi chạy:
> ```bash
> export JAVA_HOME="C:\Users\DELL\.jdks\openjdk-25.0.2"
> ```

**Cách 2: Chạy bằng IDE**

Mở thư mục `backend` trong **IntelliJ IDEA**, đợi Maven import xong, rồi chạy class:

```
com.bookapp.BookAppApplication
```

**Cách 3: Build rồi chạy JAR**

```bash
cd backend
mvn clean package
java -jar target/book-app-backend-1.0.0.jar
```

### Kiểm tra backend đã chạy

- Backend chạy tại: **http://localhost:8080**
- API prefix: `http://localhost:8080/api`
- Khi khởi động thành công, log hiện thông báo `Started BookAppApplication` và server lắng nghe trên port 8080.

---

## 2. Chạy Frontend

### Bước 1 — Cài đặt dependencies (chỉ cần làm 1 lần)

```bash
cd frontend
npm install
```

### Bước 2 — Chạy dev server

```bash
npm start
```

hoặc tương đương:

```bash
npx ng serve
```

### Bước 3 — Mở trình duyệt

Truy cập: **http://localhost:4200**

Frontend gọi API tại `http://localhost:8080/api` (định nghĩa trong `frontend/src/app/services/auth.service.ts`), nên **backend phải chạy trước** thì ứng dụng mới hoạt động đầy đủ.

---

## 3. Tài khoản dùng thử

Script `backend/scripts/seed_demo.py` seed dữ liệu demo cho tài khoản:

| Tài khoản | Mật khẩu |
|---|---|
| `demo` | `demo123` |

Cách seed dữ liệu mẫu (backend phải đang chạy):

```bash
cd backend/scripts
python seed_demo.py
```

Bạn cũng có thể tự **đăng ký** tài khoản mới ngay trên giao diện đăng nhập của ứng dụng.

---

## 4. Tóm tắt nhanh (checklist chạy ứng dụng)

1. [ ] PostgreSQL đang chạy, đã tạo database `bookdb`, đã sửa `username`/`password` trong `application.yml` nếu cần
2. [ ] Chạy backend: `cd backend && mvn spring-boot:run` (hoặc chạy `BookAppApplication` trong IDE)
3. [ ] Chạy frontend: `cd frontend && npm start`
4. [ ] Mở **http://localhost:4200**, đăng nhập `demo` / `demo123` (hoặc đăng ký tài khoản mới)

## Lỗi thường gặp

| Lỗi | Nguyên nhân / Cách xử lý |
|---|---|
| `Connection refused` khi chạy backend | PostgreSQL chưa chạy, hoặc sai `username`/`password` trong `application.yml`. Kiểm tra lại cấu hình. |
| `Database "bookdb" does not exist` | Chưa tạo database. Chạy `CREATE DATABASE bookdb;` |
| Frontend mở lên nhưng không có dữ liệu / lỗi API | Backend chưa chạy. Khởi động backend trước, rồi F5 lại trang. |
| CORS / API lỗi `401 Unauthorized` | Chưa đăng nhập hoặc token hết hạn (JWT hết hạn sau 24h). Đăng nhập lại. |
| `npm ERR!` khi `npm install` | Kiểm tra phiên bản Node.js (nên dùng Node 20+), thử xóa `node_modules` và `package-lock.json` rồi cài lại. |
| Lỗi phiên bản Java khi build backend | Kiểm tra `java -version`; nếu dùng nhiều JDK, đặt `JAVA_HOME` trỏ tới JDK 21+ như hướng dẫn ở trên. |

---

## 5. Build bản Production

### 5.1 Build backend thành JAR

```bash
cd backend
mvn clean package
```

Kết quả: file **`backend/target/book-app-backend-1.0.0.jar`**

Chạy JAR (không cần Maven, chỉ cần Java 21+):

```bash
java -jar target/book-app-backend-1.0.0.jar
```

### 5.2 Build frontend

```bash
cd frontend
npm run build
```

Lệnh trên tương đương `ng build --configuration production` (đây là cấu hình mặc định của project). Kết quả nằm trong thư mục:

```
frontend/dist/frontend/browser/
```

Có thể kiểm tra nhanh bằng cách phục vụ thư mục build qua một web server tĩnh bất kỳ:

```bash
cd frontend/dist/frontend/browser
npx http-server -p 8081
```

rồi mở **http://localhost:8081**.

> **Lưu ý:** Bản build production vẫn gọi API tại `http://localhost:8080/api` (cấu hình cố định trong `frontend/src/app/services/auth.service.ts`). Muốn đổi URL API, hãy sửa file đó rồi build lại.

### 5.3 Deploy lên server (gợi ý)

- **Frontend**: upload toàn bộ nội dung `frontend/dist/frontend/browser/` lên một web server tĩnh (Nginx, Apache, Vercel, Netlify...).
- **Backend**: upload JAR lên server, cài Java 21+ và PostgreSQL, sửa `application.yml` theo thông tin DB của server, rồi chạy `java -jar book-app-backend-1.0.0.jar`. Có thể dùng `nohup`/`systemd` để chạy nền:
  ```bash
  nohup java -jar book-app-backend-1.0.0.jar > app.log 2>&1 &
  ```
- Cấu hình CORS cho phép domain của frontend truy cập API nếu cần.
