import { redirect } from "next/navigation";

/** Framer homepage lives in the scrape mirror (static asset). */
export default function Home() {
  redirect("/scrape/locatrip.framer.website/");
}
