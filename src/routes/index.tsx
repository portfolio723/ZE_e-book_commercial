import { createFileRoute } from "@tanstack/react-router";
import { Flipbook } from "@/components/ebook/Flipbook";

const title = "Commercial Solar eBook | Zenith Energy";
const description =
  "An interactive 16-page eBook on the financial, operational and sustainability benefits of commercial solar, by Zenith Energy.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <h1 className="sr-only">Commercial Solar eBook — Zenith Energy</h1>
      <Flipbook />
    </>
  );
}
