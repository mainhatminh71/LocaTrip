/** Framer page content for React ports (about / tours / blogs / policies). */

export const ABOUT = {
  heroTitle: "Về chúng tôi",
  heroSub: "Du lịch là để thư thả, không phải để vội",
  heroBg:
    "https://framerusercontent.com/images/nOTKvIVT302nbJc99jtmoA2mBc.jpg",
  aboutTitle:
    "Tạo nên những chuyến trải nghiệm xứng đáng với thời gian và ngân sách",
  aboutBody: [
    "Được thành lập dựa trên niềm tin rằng du lịch nên là trải nghiệm cá nhân và dễ dàng — LocaTrip là trợ thủ du lịch đáng tin cậy.",
    "Từ những chuyến đi nghỉ cuối tuần đến những hành trình theo nhóm, chúng tôi đề cao thời gian du khách bỏ ra và giúp mỗi chuyến đi đáng nhớ hơn.",
  ],
  aboutImage:
    "https://framerusercontent.com/images/rURHZSdoSX3cawci8xHnhL9BONA.jpg",
  milestoneTitle: "Cột mốc",
  stats: [
    { value: "10,000+", label: "Chuyến đi" },
    { value: "60+", label: "Địa điểm" },
    { value: "100+", label: "Bạn đồng hành" },
    { value: "50,000+", label: "Du khách" },
    { value: "99%", label: "Satisfaction" },
    { value: "4.8 / 5", label: "Đánh giá" },
  ],
  journeyTag: "Hành trình",
  journeyTitle: "Từ ý tưởng trở thành trợ thủ tạo lịch trình du lịch đắc lực",
  journeyItems: [
    {
      title: "Thành lập",
      body: "Thành lập từ một dự án khởi nghiệp tại trường ĐH FPT với mong muốn đơn giản hóa việc lên kế hoạch du lịch.",
    },
    {
      title: "Mục tiêu tương lai",
      body: "Kì vọng phát triển web/app và áp dụng trên nhiều thành phố, giữ trải nghiệm cá nhân hóa làm trọng tâm.",
    },
  ],
  teamTag: "Đội ngũ",
  teamTitle: "Những bộ não cùng nhiệt huyết phía sau localTrip",
  team: [
    { name: "Phạm Xuân Thiên", role: "Project Supervisor" },
    { name: "Trương Quốc Lập", role: "Creative Director" },
    { name: "Hoàng Ngọc Yến Nhi", role: "Budget Planner" },
    { name: "Nguyễn Hoàng Long", role: "Software Engineer" },
    { name: "Mai Minh Nhật", role: "Product Engineer" },
  ],
} as const;

export const TOURS_PAGE = {
  heroTitle: "Mẫu lịch trình có sẵn",
  heroSub: "Du lịch dựa theo lịch trình đã được tối ưu",
  heroBg:
    "https://framerusercontent.com/images/2W9zQkhITjj1b8OOvZwnR1nRrhM.jpg",
  filters: ["Tất cả", "Thiên nhiên", "Lãng mạn", "Mạo hiểm"] as const,
} as const;

export const TOUR_CARDS = [
  {
    slug: "morocco-cultural-desert-journey",
    title: "Thung lũng Tình Yêu",
    days: "3 ngày / 2 đêm",
    price: "đ3,600K",
    filter: "Lãng mạn",
    image: "https://framerusercontent.com/images/GPNEa8sBXk6aWDS6GbYHSp7DMM.png",
  },
  {
    slug: "italy-classic-discovery",
    title: "Khám phá Langbiang",
    days: "7 Days / 6 Nights",
    price: "đ1,400K",
    filter: "Thiên nhiên",
    image: "https://framerusercontent.com/images/MBAx1mHhNJTAWa0PKC0AtH64oBI.png",
  },
  {
    slug: "paris-classics",
    title: "Săn Mây Đồi Thiên Phúc Đức",
    days: "6 Days / 5 Nights",
    price: "đ1,500K",
    filter: "Thiên nhiên",
    image: "https://framerusercontent.com/images/5y9i7sXxka5OvOM4z5snlX7neo.png",
  },
  {
    slug: "paris-cultural-getaway",
    title: "Thác Voi – Chùa Linh Ẩn",
    days: "5 Days / 4 Nights",
    price: "đ4,100K",
    filter: "Thiên nhiên",
    image: "https://framerusercontent.com/images/6j3ZWL8yZ9iP4E4druKfCwtqxw.png",
  },
  {
    slug: "africa-safari-experience",
    title: "Đà Lạt Xanh",
    days: "8 Days / 7 Nights",
    price: "đ2,200K",
    filter: "Thiên nhiên",
    image: "https://framerusercontent.com/images/t2wnjcDDLKkJLV7VQN0iT9QzTA.png",
  },
  {
    slug: "new-york-highlights-copy",
    title: "Đà Lạt Mạo Hiểm",
    days: "6 Days / 5 Nights",
    price: "$1,300",
    filter: "Mạo hiểm",
    image: "https://framerusercontent.com/images/GPNEa8sBXk6aWDS6GbYHSp7DMM.png",
  },
  {
    slug: "spain-cultural-trail",
    title: "Đà Lạt Gia Đình",
    days: "6 Days / 5 Nights",
    price: "$1,200",
    filter: "Lãng mạn",
    image: "https://framerusercontent.com/images/MBAx1mHhNJTAWa0PKC0AtH64oBI.png",
  },
  {
    slug: "bali-cultural-retreat",
    title: "Đà Lạt Hot Trend",
    days: "6 Days / 5 Nights",
    price: "đ2,950K",
    filter: "Mạo hiểm",
    image: "https://framerusercontent.com/images/5y9i7sXxka5OvOM4z5snlX7neo.png",
  },
] as const;

export const BLOGS_PAGE = {
  heroTitle: "Travel Stories & Guides",
  heroSub: "Stories, tips, and insights to inspire your journey.",
  heroBg:
    "https://framerusercontent.com/images/uNOaiw8D5CbJIpX7nghun4PT340.jpg",
} as const;

export const BLOG_POSTS = [
  {
    slug: "discovering-island-life-beyond-luxury",
    title: "Đón bình minh ở Đà Lạt tựa như đến chốn thần tiên",
    author: "Chu Mẫn Nghi",
    date: "25 Feb 2026",
    image: "https://framerusercontent.com/images/t2wnjcDDLKkJLV7VQN0iT9QzTA.png",
    excerpt:
      "Bình minh trên phố núi — khoảnh khắc khiến Đà Lạt trở thành điểm đến khó quên.",
  },
  {
    slug: "experiencing-europe-beyond-tourist-routes",
    title: "Festival Hoa Đà Lạt năm 2019",
    author: "Chu Mẫn Nghi",
    date: "10 Mar 2026",
    image: "https://framerusercontent.com/images/L1whDyPPzOfGHiLVY1006VxFc.png",
    excerpt:
      "Sắc hoa và nhịp sống lễ hội — góc nhìn về Festival Hoa Đà Lạt.",
  },
  {
    slug: "discovering-the-calm-of-mountain-travel",
    title: "Tham quan thung lũng Atiso",
    author: "Chu Mẫn Nghi",
    date: "13 Mar 2026",
    image: "https://framerusercontent.com/images/HnZ2DNpNgFJqZSNWQ4GYf0u8bo.jpg",
    excerpt:
      "Thung lũng Atiso — không gian xanh và nhịp chậm giữa lòng cao nguyên.",
  },
  {
    slug: "discovering-the-soul-of-bali",
    title: "Nông trại cúng cưng phục vụ du lịch tại Đà Lạt",
    author: "Chu Mẫn Nghi",
    date: "19 Jan 2026",
    image: "https://framerusercontent.com/images/7TWZu3vfa0cxeoXkcRGHmncyw.jpg",
    excerpt:
      "Trải nghiệm nông trại thú cưng — góc check-in và hoạt động thân thiện gia đình.",
  },
] as const;

export const PRIVACY = {
  title: "Privacy Policy",
  sub: "We respect your privacy. Read more about how we protect your data.",
  sections: [
    {
      h: "Introduction",
      p: 'We ("Company," "we," "us," or "our") are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use LocaTrip.',
    },
    {
      h: "Information We Collect",
      p: "a) Personal Information you provide (name, email, preferences). b) Non-personal usage data. c) Cookies and similar tracking technologies.",
    },
    {
      h: "How We Use Your Information",
      p: "We use your information to generate itineraries, improve our services, communicate with you, and ensure platform security.",
    },
    {
      h: "Sharing & Disclosure of Information",
      p: "We do not sell your personal data. We may share information with service providers who assist our operations under confidentiality obligations.",
    },
    {
      h: "Data Security",
      p: "We apply reasonable technical and organizational measures to protect your data against unauthorized access or loss.",
    },
    {
      h: "Your Rights",
      p: "Depending on your location, you may request access, correction, or deletion of your personal information by contacting us.",
    },
    {
      h: "Contact Us",
      p: "Questions about this policy: info@localtrip.vn",
    },
  ],
} as const;

export const TERMS = {
  title: "Terms & Conditions",
  sub: "Engaging with our website indicates your agreement with our terms.",
  sections: [
    {
      h: "Introduction",
      p: "These Terms & Conditions govern your use of the LocaTrip website and related services.",
    },
    {
      h: "Use of Our Website",
      p: "You agree to use the site for lawful purposes only and not to misuse itinerary generation or other features.",
    },
    {
      h: "Intellectual Property Rights",
      p: "Content, branding, and software on LocaTrip are protected. You may not copy or redistribute without permission.",
    },
    {
      h: "Content Accuracy & Availability",
      p: "Itineraries and place data are provided for guidance. Availability and prices may change.",
    },
    {
      h: "Limitation of Liability",
      p: "To the fullest extent permitted by law, LocaTrip is not liable for indirect damages arising from use of the service.",
    },
    {
      h: "Contact",
      p: "For terms questions: info@localtrip.vn",
    },
  ],
} as const;

export const NOT_FOUND = {
  title: "Oops …",
  body: "You’ve reached a page that doesn’t exist — or may have been moved.",
  support: "Let’s get you back home.",
  cta: "Back to Home",
} as const;
