# Web3 Move Library Backend

Mã nguồn Backend cho nền tảng thư viện Web3, được xây dựng bằng Node.js, Express và TypeScript.

## Chức năng chính

- **Xác thực giao dịch**: Kiểm tra tính hợp lệ của Transaction Digest trên mạng lưới Sui.
- **Quản lý dữ liệu sách**: Cung cấp API danh sách sách (thay thế cho database thực tế bằng `database.json`).
- **Bảo mật**: Chỉ cấp link truy cập/tải sách sau khi giao dịch đã được xác nhận on-chain.

## Cấu trúc thư mục

- `src/index.ts`: Điểm khởi đầu của ứng dụng.
- `src/routes/`: Định nghĩa các API endpoints.
- `src/controllers/`: Xử lý logic nghiệp vụ.
- `src/services/`: Tương tác với Sui SDK để kiểm tra giao dịch.
- `database.json`: Mock database chứa dữ liệu sách.

## Hướng dẫn cài đặt

1. Cài đặt dependencies:
   ```bash
   pnpm install
   ```

2. Cấu hình môi trường:
   Tạo tệp `.env` dựa trên `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Chạy ứng dụng:
   - Chế độ phát triển: `pnpm dev`
   - Build: `pnpm build`
   - Chạy production: `pnpm start`

## API Endpoints (Mặc định: http://localhost:3001)

- `GET /api/books`: Lấy danh sách tất cả các sách.
- `GET /api/books/:id`: Lấy thông tin chi tiết một cuốn sách.
- `POST /api/verify-transaction`: Xác minh giao dịch mua sách.
