import { SettingsContent } from "./SettingsContent";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const search = await searchParams;
  return <SettingsContent tab={search.q || "account"} />;
}
