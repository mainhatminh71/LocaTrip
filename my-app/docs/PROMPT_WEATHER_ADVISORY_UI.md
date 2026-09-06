# Prompt: Nâng cấp Giao diện & Trải nghiệm Widget Thời tiết Chuyến đi (Weather Advisory UI Polish)

Copy-paste toàn bộ prompt này cho agent / Frontend developer đang làm việc trong thư mục **`c:\LocaTrip\my-app`**.

---

## 1. Mục tiêu & Định hướng thiết kế

Nâng cấp widget dự báo thời tiết & cảnh báo thông minh (`TripWeatherAdvisoryWidget`) trong chuyến đi (`/my-trips/[tripId]` và `BookATripView`) đạt chuẩn **hiện đại, trực quan, tinh tế (Premium Travel UX)** theo phong cách thương hiệu **LocaTrip**:

- **Màu sắc thương hiệu**: `--lt-teal` (`#0a6b7c`), `--lt-deep` (`#012830`), `--lt-emerald` (`#3ddc97`), nền kính mờ (Glassmorphism), gradient nhẹ nhàng.
- **Micro-interactions**: Sử dụng `framer-motion` cho hiệu ứng chuyển động mượt mà khi load dữ liệu, hover card, bung chi tiết.
- **Tích hợp sâu vào Timeline**: Không chỉ hiển thị khối tổng quan ở đầu trang, mà còn gắn huy hiệu (badge cảnh báo thời tiết) trực tiếp vào từng thẻ điểm dừng trong lịch trình.

---

## 2. Các điểm cần nâng cấp cụ thể trên Frontend

### A. Widget Tổng quan Thời tiết (`TripWeatherAdvisoryWidget.tsx`)

1. **Header & Card Container**:
   - Sử dụng hiệu ứng nền Glassmorphism (`backdrop-filter: blur(12px)`, viền mờ `1px solid rgba(10, 107, 124, 0.15)`).
   - Thêm nút **Làm mới dự báo** (Refresh icon với animation xoay khi loading).
   - Thanh tóm tắt nhanh (`overallSummary`) với tone màu pastel thanh lịch.

2. **Dải thẻ Thời tiết theo ngày (Daily Weather Carousel/Grid)**:
   - Card từng ngày có trạng thái **Active/Selected**: Click vào Ngày nào thì lọc các cảnh báo của Ngày đó.
   - Thể hiện trực quan: Icon thời tiết kích thước lớn, thanh đo xác suất mưa dạng mini-pill, dải nhiệt độ min–max dạng thanh gradient màu.

3. **Bộ lọc & Danh sách Cảnh báo thông minh (Smart Alerts)**:
   - **Thanh Filter Tabs**: `Tất cả` | `🌧️ Mưa & Dông` | `☀️ Nắng & UV` | `🧥 Rét & Sương mù`.
   - Alert Card thiết kế dạng danh thiếp bo góc mềm mại:
     - Warning (`severity: 'warning'`): Viền vàng cam ấm áp, icon dập nổi.
     - Info (`severity: 'info'`): Viền xanh dịu, icon nổi bật.
     - Phần lời khuyên (`advice`) hiển thị dạng quote/tip với icon bóng đèn 💡.

4. **Skeleton Loading Shimmer**:
   - Thay thế chữ "Đang tải..." bằng khung xương skeleton nhấp nháy ánh kim (shimmer animation) theo layout grid thẻ ngày.

---

### B. Gắn Badge Thời tiết trực tiếp vào Timeline Điểm dừng

- Tại các điểm dừng trong lịch trình (`ScheduledStop` trong `my-trips/[tripId]` và `BookATripView`):
  - So khớp `day` và `time` của điểm dừng với danh sách `advisory.alerts`.
  - Nếu có cảnh báo thời tiết tương ứng, hiển thị một **mini-chip** bên cạnh tên địa điểm (Ví dụ: `🌧️ Có thể mưa lúc 14:30`).
  - Khi hover hoặc click vào chip sẽ mở popover/tooltip chi tiết lời khuyên chuẩn bị.

---

## 3. Cấu trúc Component đề xuất

```text
my-app/
├── components/
│   └── weather/
│       ├── TripWeatherAdvisoryWidget.tsx   # Widget chính (Header, Days Grid, Alerts)
│       ├── WeatherDayCard.tsx              # Thẻ thời tiết từng ngày (Interactive)
│       ├── WeatherAlertCard.tsx            # Card cảnh báo thông minh theo phân loại
│       ├── WeatherStopBadge.tsx            # Mini-badge gắn trực tiếp vào timeline
│       ├── WeatherSkeleton.tsx             # Skeleton loading cao cấp
│       └── weather.module.css              # Style hiện đại, CSS variables, Glassmorphism
```

---

## 4. API & Types tham chiếu (Có sẵn)

Frontend gọi API proxy đã cấu hình sẵn:
- Endpoint: `GET /api/trips/:tripId/weather`
- Hàm: `getTripWeather(tripId)` từ `@/lib/api/trips`

```typescript
export type WeatherScheduleAlert = {
  dayNumber: number;
  date: string;
  time: string;
  placeTitle: string;
  type: "rain" | "thunderstorm" | "heat_uv" | "cold" | "general";
  severity: "warning" | "info";
  icon: string;
  message: string;
  advice: string;
};

export type TripWeatherAdvisory = {
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  locationCoords: { latitude: number; longitude: number };
  overallSummary: string;
  dailyForecast: DailyWeatherSummary[];
  alerts: WeatherScheduleAlert[];
};
```

---

## 5. Checklist nghiệm thu (Verification Checklist)

- [ ] Widget hiển thị đồng bộ với giao diện thương hiệu LocaTrip trên cả desktop và mobile.
- [ ] Chọn ngày trên dải thời tiết lọc đúng cảnh báo của ngày đó.
- [ ] Các thẻ cảnh báo phân biệt rõ mức độ (Màu cam/đỏ cho dông bão/mưa lớn, màu xanh dịu cho UV/nhiệt độ).
- [ ] Timeline hiển thị mini-badge thời tiết tại các điểm dừng có nguy cơ thời tiết xấu.
- [ ] Loading skeleton mượt mà, không bị giật layout (layout shift) khi dữ liệu tải xong.
- [ ] `npm run build` hoàn thành không có lỗi TypeScript / CSS.
