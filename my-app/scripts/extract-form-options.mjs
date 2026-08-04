import fs from "node:fs";

const html = fs.readFileSync(
  "public/scrape/locatrip.framer.website/book-a-trip/index.html",
  "utf8",
);

// Find option-like strings near form keywords
for (const key of [
  "Thời lượng",
  "Ngân sách",
  "Đi mấy người",
  "Ngày khởi hành",
  "Ưu tiên",
  "Bắt đầu tạo",
]) {
  const i = html.indexOf(key);
  console.log("\n====", key, i);
  if (i < 0) continue;
  const slice = html.slice(i, i + 2500);
  const texts = [
    ...slice.matchAll(/>([^<]{2,80})</g),
  ].map((m) => m[1].trim()).filter(Boolean);
  console.log([...new Set(texts)].slice(0, 40).join(" | "));
}
