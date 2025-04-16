import UsersContent from "./UsersContent";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const search = await searchParams;
  return <UsersContent tab={search.q || "suppliers"} />;
}
