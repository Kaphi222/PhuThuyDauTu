# Hướng Dẫn Kích Hoạt Telegram Mini App (TMA) — Định Giá Cổ Phiếu

Thư mục `TelegramMiniApp` chứa toàn bộ mã nguồn Web App được tối ưu riêng cho **Telegram Mini App (TMA)**. Người dùng có thể mở ứng dụng ngay trong app Telegram trên cả **iPhone (iOS)** và **Android** với trải nghiệm mượt mà như app bản địa (Native App).

---

## 🛠️ Các Bước Cấu Hình Nhanh

### Bước 1: Deploy Web App Lên Hosting Chi Phí 0đ (Vercel / GitHub Pages / Cloudflare Pages)

#### Lựa chọn A: Vercel (Khuyên dùng - Nhanh nhất 1 phút)
1. Tải và cài đặt [Vercel CLI](https://vercel.com) hoặc đẩy thư mục `TelegramMiniApp` lên GitHub.
2. Tại thư mục `TelegramMiniApp`, chạy lệnh:
   ```bash
   npx vercel
   ```
3. Bạn sẽ nhận được 1 link HTTPS duy nhất (Ví dụ: `https://phuthuydautubot-tma.vercel.app`).

#### Lựa chọn B: GitHub Pages (Miễn phí vĩnh viễn)
1. Tạo một repository trên GitHub và upload các file trong `TelegramMiniApp/` lên.
2. Vào **Settings** > **Pages** > Chọn **Branch: main / root** > **Save**.
3. Link Web App sẽ có dạng: `https://<ten-user>.github.io/<ten-repo>/`.

---

### Bước 2: Đăng Ký Telegram Mini App Với @BotFather

1. Trên Telegram, tìm kiếm và mở bot **`@BotFather`**.
2. Gửi lệnh: `/newapp`
3. Chọn bot của bạn: `@PhuThuyDauTubot`
4. Điền các thông tin theo yêu cầu của BotFather:
   - **Title**: `Phù Thủy Đầu Tư - Định Giá Cổ Phiếu`
   - **Description**: `Tra cứu Fair Value, Upside % và Định Giá Siêu Rẻ realtime cho nhà đầu tư VN.`
   - **Photo**: Tải lên 1 ảnh đại diện 640x360 px.
   - **Web App URL**: Dán đường dẫn HTTPS ở **Bước 1** vào đây (Ví dụ: `https://phuthuydautubot-tma.vercel.app`).
   - **Short Name**: `dinhgia`
5. Kết quả: Bạn sẽ nhận được link truy cập dạng Telegram Direct Link: `https://t.me/PhuThuyDauTubot/dinhgia`!

---

### Bước 3: Cài Nút Menu "📊 Định Giá Cổ Phiếu" Cho Bot Telegram

Để người dùng bấm vào nút Menu góc dưới bên trái ô chat Telegram là mở ngay Web App:

1. Trong chat với **`@BotFather`**, gửi lệnh: `/setmenubutton`
2. Chọn bot: `@PhuThuyDauTubot`
3. Chọn loại nút: **Configure menu button**
4. Nhập tiêu đề nút: `📊 Định Giá Cổ Phiếu`
5. Dán URL Web App ở Bước 1 vào.

---

## 🔒 Cam Kết An Toàn Hệ Thống

Toàn bộ ứng dụng `TelegramMiniApp` hoạt động độc lập qua API `doGet?action=valuation` đã có sẵn trong Google Apps Script `Code.js`. 
- **Không chỉnh sửa / không gây lỗi** cho bất kỳ file code cũ nào của bạn (`Code.js`, `StockValuationService.js`, `Extention_DinhGiaCP/...`).
