
import { SingleSalesByName } from "./SingleSalesByName";
import { Data} from "../Data"; // Assuming Data is an array of sales data


export default function SalesPage({
  params,
}: {
  params: { name: string[] };
}) {

  

  // Get full name from route params
  const fullName = params.name.join('/');
  const decodedName = decodeURIComponent(fullName);

  // Filter sales data for this employer
  const filteredSales = Data.filter(
    (sale) => sale.employer === decodedName
  );

  return (
    <SingleSalesByName 
      name={decodedName}
      sales={filteredSales}
    />
  );
}