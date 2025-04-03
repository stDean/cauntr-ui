import { cn } from "@/lib/utils";
import Link from "next/link";

export const TabNavigation = ({
  activeTab,
  tabs,
  basePath,
}: {
  activeTab: string;
  tabs: { label: string; query: string }[];
  basePath: string;
}) => {
  return (
    <div className="border-b">
      <div className="my-2 px-10 flex gap-4 text-xs">
        {tabs.map(({ label, query }) => (
          <Link key={query} href={`${basePath}?q=${query}`} className="m-0">
            <div>
              <p className={cn({ "font-bold": activeTab === query })}>
                {label}
              </p>
              {activeTab === query && (
                <hr className="bg-[#0C049B] h-[3px] mt-1 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
