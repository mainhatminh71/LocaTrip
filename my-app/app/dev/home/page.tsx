import { redirect } from "next/navigation";

/** Production homepage is `/` (LocaTripHeroExport port). */
export default function HomeDevRedirect() {
  redirect("/");
}
