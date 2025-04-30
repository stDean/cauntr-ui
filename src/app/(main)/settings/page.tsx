import { SettingsContent } from "./SettingsContent";

interface SettingsProps {
  params: Promise<{}>; // always a promise
  searchParams: Promise<{ q?: string }>;
}

export default async function SettingsPage({
  params,
  searchParams,
}: SettingsProps) {
  const { q } = await searchParams;
  return <SettingsContent tab={q || "account"} />;
}
