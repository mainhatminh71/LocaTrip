/**
 * Local media in /public/media (Unsplash travel / Da Lat–style stock).
 * No scrape or Framer CDN dependency for page images.
 */
export const IMG = {
  logo: "/media/logo.png",
  homeHero: "/media/dalat-lake.jpg",
  hero1: "/media/float-1.jpg",
  hero2: "/media/float-2.jpg",
  hero3: "/media/float-3.jpg",
  hero4: "/media/float-4.jpg",
  aboutMain: "/media/vietnam-street.jpg",
  aboutSide: "/media/dalat-hills.jpg",
  whyBg: "/media/sunset-hills.jpg",
  exp1: "/media/temple.jpg",
  exp2: "/media/mountain-mist.jpg",
  exp3: "/media/forest-path.jpg",
  exp4: "/media/market.jpg",
  dest1: "/media/vietnam-street.jpg",
  dest2: "/media/dalat-lake.jpg",
  dest3: "/media/dalat-hills.jpg",
  dest4: "/media/mountain-mist.jpg",
  tour1: "/media/travelers.jpg",
  tour2: "/media/mountain-mist.jpg",
  tour3: "/media/sunset-hills.jpg",
  tour4: "/media/forest-path.jpg",
  tour5: "/media/dalat-lake.jpg",
  why1: "/media/waterfall.jpg",
  why2: "/media/cafe-view.jpg",
  why3: "/media/temple.jpg",
  why4: "/media/market.jpg",
  testimonial: "/media/travelers.jpg",
  avatar1: "/media/avatar-1.jpg",
  avatar2: "/media/avatar-2.jpg",
  avatar3: "/media/avatar-3.jpg",
  blog1: "/media/sunset-hills.jpg",
  blog2: "/media/cafe-view.jpg",
  story1: "/media/sunset-hills.jpg",
  story2: "/media/dalat-lake.jpg",
  story3: "/media/cafe-view.jpg",
  footer: "/media/dalat-hills.jpg",
} as const;

export const heroStats = [
  {
    kind: "google" as const,
    text: "4.9 sao (124k Reviews)",
  },
  {
    kind: "people" as const,
    text: "50k travellers",
  },
  {
    kind: "ig" as const,
    text: "15k followers",
  },
] as const;

export const experiences = [
  {
    title: "Văn hóa bản địa",
    desc: "Những con phố ở Đà Lạt được bao quanh bởi những biệt thự Pháp quyến rũ, theo phong cách Gothic",
    image: IMG.exp1,
    images: [IMG.exp1, IMG.dest1, IMG.aboutSide],
  },
  {
    title: "Thiên nhiên hùng vĩ",
    desc: "Khí hậu mát mẻ quanh năm, những đồi thông bạt ngàn, thác nước hùng vĩ và thung lũng ngập tràn hoa cỏ",
    image: IMG.exp2,
    images: [IMG.exp2, IMG.dest2, IMG.aboutMain],
  },
  {
    title: "Lạc vào xứ sở sương mù",
    desc: "Không khí lạnh và độ ẩm cao tạo nên lớp sương mù đặc trưng",
    image: IMG.exp3,
    images: [IMG.exp3, IMG.dest3, IMG.hero3],
  },
  {
    title: "Quay về quá khứ",
    desc: "Ga Đà Lạt là nhà ga cổ nhất và đẹp nhất Đông Dương",
    image: IMG.exp4,
    images: [IMG.exp4, IMG.dest4, IMG.hero4],
  },
] as const;

/** Framer Destinations order */
export const destinations = [
  {
    title: "Hồ Tuyền Lâm",
    subtitle: "Mặt hồ yên ả giữa rừng thông",
    image: IMG.dest2,
    images: [IMG.dest2, IMG.exp2, IMG.homeHero],
  },
  {
    title: "Đồi Chè Cầu Đất",
    subtitle: "Đồi chè xanh ngát nhìn từ trên cao",
    image: IMG.dest3,
    images: [IMG.dest3, IMG.exp3, IMG.aboutSide],
  },
  {
    title: "LangBiang",
    subtitle: "Đỉnh núi biểu tượng của Đà Lạt",
    image: IMG.dest4,
    images: [IMG.dest4, IMG.exp4, IMG.why1],
  },
  {
    title: "Trung tâm Đà Lạt",
    subtitle: "Nhịp sống phố núi và góc check-in kinh điển",
    image: IMG.dest1,
    images: [IMG.dest1, IMG.aboutMain, IMG.exp1],
  },
] as const;

export const tours = [
  {
    days: "3 ngày / 2 đêm",
    title: "Thung lũng Tình Yêu",
    price: "đ3,600K",
    image: IMG.tour1,
  },
  {
    days: "7 Days / 6 Nights",
    title: "Khám phá Langbiang",
    price: "đ1,400K",
    image: IMG.tour2,
  },
  {
    days: "6 Days / 5 Nights",
    title: "Săn Mây Đồi Thiên Phúc Đức",
    price: "đ1,500K",
    image: IMG.tour3,
  },
  {
    days: "8 Days / 7 Nights",
    title: "Đà Lạt Xanh",
    price: "đ2,200K",
    image: IMG.tour4,
  },
  {
    days: "7 Days / 6 Nights",
    title: "Cắm Trại Hồ Tuyền Lâm",
    price: "đ1,200K",
    image: IMG.tour5,
  },
] as const;

export const whyUs = [
  {
    title: "Nhanh chóng và Tiện lợi",
    desc: "Tự động tạo lịch trình và quản lý chi tiêu",
  },
  {
    title: "Tính cá nhân hóa",
    desc: "Tùy chỉnh theo sở thích và nhu cầu",
  },
  {
    title: "Kho tài nguyên luôn cập nhật",
    desc: "Đổi mới trải nghiệm mỗi lần dùng",
  },
] as const;

export const blogs = [
  {
    author: "Chu Mẫn Nghi",
    date: "25 Feb 2026",
    title: "Đón bình minh ở Đà Lạt tựa như đến chốn thần tiên",
    image: IMG.blog1,
  },
  {
    author: "Chu Mẫn Nghi",
    date: "10 Mar 2026",
    title: "Festival Hoa Đà Lạt năm 2019",
    image: IMG.blog2,
  },
] as const;

export const pricingPlans = [
  {
    name: "Bình thường",
    monthly: "FREE",
    yearly: "FREE",
    features: ["1 projects", "Analytics", "Insights Panel", "Share Features"],
    cta: "Sign up",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: "đ59.000",
    yearly: "đ470.000",
    features: ["2 projects", "Analytics", "Insights Panel", "Share Features"],
    cta: "Sign up",
    highlight: true,
  },
  {
    name: "Doanh nghiệp",
    monthly: "đ209.000",
    yearly: "đ1.990K",
    features: [
      "Unlimited Projects",
      "Analytics",
      "Insights Panel",
      "Share Features",
    ],
    cta: "Sign up",
    highlight: false,
  },
] as const;

export const navLinks = [
  { label: "Về chúng tôi", href: "/about" },
  { label: "Tours", href: "/tours" },
  { label: "Tạo lịch trình", href: "/book-a-trip" },
  { label: "Blogs", href: "/blogs" },
] as const;

export const footerPages = [
  { label: "Trang chủ", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Tạo lịch trình", href: "/book-a-trip" },
] as const;

export const footerDocs = [
  { label: "Chính sách bảo mật", href: "/policies/privacy-policy" },
  { label: "Điều khoản và dịch vụ", href: "/policies/terms-conditions" },
] as const;

export const marqueeItems = [
  "Tours tùy chỉnh",
  "Đi đến mọi ngóc ngách",
  "Tối ưu ngân sách",
  "Hỗ trợ tức thì",
  "Tiện ích vô vàng",
  "Di chuyển dễ dàng",
] as const;
