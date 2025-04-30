import UsersContent from "./UsersContent";

interface SearchProps {
  params: Promise<{}>; // always a promise
  searchParams: Promise<{ q?: string }>;
}

export default async function SettingsPage({ searchParams }: SearchProps) {
  const search = await searchParams;

  return <UsersContent tab={search.q || "suppliers"} />;
}
