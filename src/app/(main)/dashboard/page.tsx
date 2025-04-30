import DashboardContent from "./DashboardContent";

interface SearchProps {
  params: Promise<{}>; // always a promise
  searchParams: Promise<{ q?: string }>;
}

export default async function SettingsPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  return <DashboardContent tab={q || "overview"} />;
}
