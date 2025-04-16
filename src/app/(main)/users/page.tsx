import UsersContent from "./UsersContent";

interface SearchProps {
  searchParams: { q?: string };
}

export default async function SettingsPage({ searchParams }: SearchProps) {
  const search = await searchParams;

  return <UsersContent tab={search.q || "suppliers"} />;
}
