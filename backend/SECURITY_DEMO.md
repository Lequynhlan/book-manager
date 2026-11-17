Tài liệu này mô tả API minh họa để thử luồng Semgrep → LLM. Endpoint chỉ được đăng ký khi bật Spring profile `security-demo`; không bật profile này trong môi trường thật.

Chạy từ thư mục `backend`:

```cmd
set SPRING_PROFILES_ACTIVE=security-demo
set APP_SECURITY_DEMO_DOCUMENT_ROOT=demo-documents
mvn spring-boot:run
```

Đăng nhập bằng tài khoản demo để lấy JWT, sau đó gọi:

```http
GET /api/demo/documents?name=guide.txt
Authorization: Bearer <JWT>
```

Ví dụ PowerShell:

```powershell
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/login `
  -ContentType 'application/json' -Body '{"username":"demo","password":"demo123"}'
Invoke-RestMethod -Uri 'http://localhost:8080/api/demo/documents?name=guide.txt' `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

Endpoint đọc tài liệu bên trong `demo-documents` và kiểm tra cả đường dẫn đã chuẩn hóa lẫn đường dẫn thực để chặn traversal/symlink escape. Semgrep vẫn có thể báo luồng dữ liệu request tới `Files.readString`; đây là cảnh báo chủ ý để bot/LLM xem xét validation tại điểm đọc. Rule đó không chứng minh có lỗ hổng khai thác được.

Profile không được bật mặc định. Đây là fixture kiểm thử SAST, không phải chức năng sản phẩm; không bật profile khi deploy. Kiểm thử: `mvn test`.
