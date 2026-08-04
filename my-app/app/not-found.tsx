import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { NotFoundView } from "@/components/pages/NotFoundView";

export default function NotFound() {
  return (
    <MarketingChrome hideConversion>
      <NotFoundView />
    </MarketingChrome>
  );
}
