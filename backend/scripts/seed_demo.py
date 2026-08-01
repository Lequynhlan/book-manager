# -*- coding: utf-8 -*-
"""Seed demo books for the demo user."""
import json
import urllib.request

BASE = "http://localhost:8080/api"

def post(path, data, token=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(data).encode("utf-8"),
                                 headers={"Content-Type": "application/json",
                                          "Authorization": f"Bearer {token}" if token else ""})
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def get(path, token=None):
    req = urllib.request.Request(BASE + path, headers={"Authorization": f"Bearer {token}" if token else ""})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

# login as demo
status, body = post("/auth/login", {"username": "demo", "password": "demo123"})
assert status == 200, body
token = body["token"]

books = [
    {"title": "Đắc Nhân Tâm", "author": "Dale Carnegie", "category": "Self-help", "status": "DA_DOC",
     "rating": 5, "description": "Cuốn sách kinh điển về nghệ thuật ứng xử và giao tiếp.",
     "link": "https://vi.wikipedia.org/wiki/Đắc_nhân_tâm"},
    {"title": "Nhà Giả Kim", "author": "Paulo Coelho", "category": "Tiểu thuyết", "status": "DA_DOC",
     "rating": 5, "description": "Hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
     "link": "https://vi.wikipedia.org/wiki/Nhà_giả_kim"},
    {"title": "Clean Code", "author": "Robert C. Martin", "category": "IT", "status": "DANG_DOC",
     "rating": 4, "description": "Nguyên tắc viết code sạch cho lập trình viên.",
     "link": "https://www.oreilly.com/library/view/clean-code/9780136083238/"},
    {"title": "Atomic Habits", "author": "James Clear", "category": "Self-help", "status": "MUON_DOC",
     "rating": 0, "description": "Xây dựng thói quen tốt từ những thay đổi nhỏ.",
     "link": "https://jamesclear.com/atomic-habits"},
    {"title": "Số Đỏ", "author": "Vũ Trọng Phụng", "category": "Văn học", "status": "DANG_DOC",
     "rating": 4, "description": "Tác phẩm trào phúng kinh điển của văn học Việt Nam."},
    {"title": "Rừng Na Uy", "author": "Haruki Murakami", "category": "Tiểu thuyết", "status": "BO_QUA",
     "rating": 1, "description": "Tiểu thuyết về tình yêu và tuổi trẻ của Murakami.",
     "link": "https://vi.wikipedia.org/wiki/Rừng_Na_Uy"},
    {"title": "Hành Trình Về Phương Đông", "author": "Baird T. Spalding", "category": "Tâm linh", "status": "MUON_DOC",
     "rating": 0, "description": "Câu chuyện về hành trình tìm kiếm tri thức phương Đông."},
    {"title": "Lập Trình Java Căn Bản", "author": "Nguyễn Hữu Nghĩa", "category": "IT", "status": "DA_DOC",
     "rating": 4, "description": "Giáo trình lập trình Java từ cơ bản đến nâng cao."},
]

created = 0
for b in books:
    status, body = post("/books", b, token)
    if status == 201:
        created += 1
    else:
        print("FAIL:", status, body)

print(f"Created {created}/{len(books)} books")
lst = get("/books", token)
print(f"Total books for demo user: {len(lst)}")

# verify isolation: user2 should still see nothing
status, body = post("/auth/login", {"username": "user2", "password": "pass123"})
token2 = body["token"]
print(f"user2 books: {len(get('/books', token2))}")
