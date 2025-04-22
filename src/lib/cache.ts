import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

// Define a TypeScript union type for valid cache tags based on the return values
// of the tag-generating functions below.
export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  user: "user",
  users: "users",
  companyAccount: "companyAccount",
  subscriptionHistory: "subscriptionHistory",
  inventoryProducts: "inventoryProducts",
  inventoryStats: "inventoryStats",
  suppliers: "suppliers",
  allProducts: "allProducts",
  customers: "customers",
  categories: "categories",
  transaction: "transaction",
  singleTransaction: "singleTransaction",
  banks: "banks",
  debtors: "debtors",
  debtor: "debtor",
  supplier: "supplier",
  customer: "customer",
  item: "item",
  invoices: "invoices",
} as const;

/**
 * Generates a global cache tag.
 *
 * @param tag - A key of CACHE_TAGS. For example, "users" or "subscription".
 * @returns A string in the format "global:{value}".
 */
export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

/**
 * Generates a user-specific cache tag.
 *
 * @param userId - The unique identifier for a user.
 * @param tag - A key of CACHE_TAGS.
 * @returns A string in the format "user:{userId}-{value}".
 */
export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

/**
 * Generates an ID-specific cache tag.
 *
 * @param id - A generic identifier (could be for a product, record, etc.).
 * @param tag - A key of CACHE_TAGS.
 * @returns A string in the format "id:{id}-{value}".
 */
export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

/**
 * Clears (or revalidates) the entire cache by revalidating all tags.
 *
 * Uses the wildcard "*" to target all cache entries.
 */
export function clearFullCache() {
  revalidateTag("*");
}

/**
 * A helper function to cache database calls.
 *
 * It wraps the unstable_cache function (from Next.js) with our own caching logic
 * and attaches provided cache tags plus a wildcard "*" tag.
 *
 * @param cb - The asynchronous callback function to be cached.
 * @param tags - An object containing an array of valid tags to associate with this cache entry.
 * @returns The cached version of the provided callback.
 */
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) {
  // Spread the provided tags and add the "*" tag to always allow a full cache revalidation.
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }));
}

/**
 * Revalidates the database cache for a specific tag.
 *
 * It revalidates:
 * - The global tag.
 * - Optionally a user-specific tag if a userId is provided.
 * - Optionally an id-specific tag if an id is provided.
 *
 * @param tag - The key of CACHE_TAGS to revalidate.
 * @param userId - (Optional) The user identifier.
 * @param id - (Optional) A generic identifier.
 */
export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  // Revalidate the global cache entry for the given tag.
  revalidateTag(getGlobalTag(tag));

  // If a userId is provided, revalidate the corresponding user-specific tag.
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }

  // If an id is provided, revalidate the corresponding id-specific tag.
  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
}
