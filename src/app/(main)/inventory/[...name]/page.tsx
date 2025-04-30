import { GetProductByName } from "@/actions/inventory.a";
import { cookies } from "next/headers";
import { SingleProductsByName } from "./SingleProductsByName";

interface ProductsProps {
  params: Promise<{ name: string[] }>;
}

export default async function page({ params }: ProductsProps) {
  const routeParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const getProduct = await GetProductByName({
    token,
    userId,
    brand: routeParams.name[1],
    type: routeParams.name[0],
    name: routeParams.name[2],
  });

  const products = getProduct.success.data;
  return (
    <SingleProductsByName
      type={routeParams.name[0]}
      brand={routeParams.name[1]}
      products={products}
    />
  );
}
