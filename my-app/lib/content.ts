/**
 * Assets copied from Framer Chrome-save (_files), same hashes as HTML.
 * Hero order in Framer SSR: logo → hero-bg → float×4 → icons…
 */
export const IMG = {
  logo: "/home/logo.png",
  homeHero: "/home/hero-bg.jpg",
  /** Floating cards around hero (Framer order) */
  hero1: "/home/float-1.png",
  hero2: "/home/float-2.png",
  hero3: "/home/float-3.png",
  hero4: "/home/float-4.png",
  iconGoogle: "/home/icon-pin.svg",
  iconPeople: "/home/icon-people.svg",
  iconIg: "/home/icon-bird.svg",
  /** Framer About dual images (exact CDN filenames from scrape) */
  aboutMain:
    "https://framerusercontent.com/images/AH8SH5eDglzjKBPBQFq3Yo7Nmrw.png",
  aboutSide:
    "https://framerusercontent.com/images/mzvUBcw1Da0Uo6Zh4sidKqIebA.png",
  whyBg:
    "https://framerusercontent.com/images/Wf2MNykv3Zg5ogSRxiaSZFyJGdI.jpg",
  exp1: "https://framerusercontent.com/images/EjalgXG0z9c7pOuDSiGNaxtaheU.png",
  exp2: "https://framerusercontent.com/images/6rWPmbqDQO9hJIhXRVDVCRbWUo.png",
  exp3: "https://framerusercontent.com/images/sE84HzSdps9I8RvYi3apLLt1m8.png",
  exp4: "https://framerusercontent.com/images/dxFaHkdx8IDfjbztuPt6XStL5M.png",
  dest1: "https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg",
  dest2: "https://framerusercontent.com/images/pFmTQeAfrl6ODSYhTm5iCVFyHc.jpg",
  dest3: "https://framerusercontent.com/images/Wjm1G19SGwvkVURQAKYBJiyXHIs.jpg",
  dest4: "https://framerusercontent.com/images/xPq9YoLQc0DjJyTkUVKVGxOgZzU.png",
  tour1: "https://framerusercontent.com/images/GPNEa8sBXk6aWDS6GbYHSp7DMM.png",
  tour2: "https://framerusercontent.com/images/MBAx1mHhNJTAWa0PKC0AtH64oBI.png",
  tour3: "https://framerusercontent.com/images/5y9i7sXxka5OvOM4z5snlX7neo.png",
  tour4: "https://framerusercontent.com/images/6j3ZWL8yZ9iP4E4druKfCwtqxw.png",
  tour5: "https://framerusercontent.com/images/t2wnjcDDLKkJLV7VQN0iT9QzTA.png",
  why1: "https://framerusercontent.com/images/SV1MiT2BJSPLRUGiJqhm8CRVHkg.jpg",
  why2: "https://framerusercontent.com/images/TbABSK0jO0lK92h2zYYIMJTiusY.jpg",
  why3: "https://framerusercontent.com/images/rpVOKYpAImjkvR673iT3Gjc4XI.jpg",
  why4: "https://framerusercontent.com/images/j5yLKM0E783r5ug16dHihjxz6c.png",
  testimonial:
    "https://framerusercontent.com/images/o2lDRrcAtneLj0hShUdzHpIYRGI.png",
  avatar1:
    "https://framerusercontent.com/images/Z8uoeno7ffCAB8uZsn9MJcoSw.jpg",
  avatar2:
    "https://framerusercontent.com/images/1qOlVnV2OGWz5QUAwfV5EkSHxNc.jpg",
  avatar3:
    "https://framerusercontent.com/images/cQDM4UGHbkNJdKaXIcNdkbMAbo.jpg",
  blog1: "https://framerusercontent.com/images/L1whDyPPzOfGHiLVY1006VxFc.png",
  blog2: "https://framerusercontent.com/images/NPVGQTBuWTgKghTzjcUHJMKAX6Y.jpg",
  story1: "https://framerusercontent.com/images/RAenYu1Zwzu8EU9Z2pipfgakApQ.png",
  story2: "https://framerusercontent.com/images/wQHTCAms5SNygRswHiQwBRhtI.png",
  story3: "https://framerusercontent.com/images/mzvUBcw1Da0Uo6Zh4sidKqIebA.png",
  footer:
    "https://framerusercontent.com/images/mzvUBcw1Da0Uo6Zh4sidKqIebA.png",
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
