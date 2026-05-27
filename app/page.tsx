import { redirect } from "next/navigation";

// The root page redirects to the default locale.
// next-intl middleware handles locale detection and routing,
// but this ensures a direct "/" visit is handled gracefully.
export default function RootPage() {
  redirect("/en");
}
