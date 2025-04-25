import DashboardContent from "./DashboardContent";

interface SearchProps {
  searchParams: { q?: string };
}

export default async function SettingsPage({ searchParams }: SearchProps) {
  const search = await searchParams;

  return <DashboardContent tab={search.q || "overview"} />;
}
