
interface Props {
  data: any[];
  name: string;
  secondColumn: string;
  secondData: any;
}

export const StockDataTable = ({
  data,
  name,
  secondColumn,
  secondData,
}: Props) => {
  return (
    <div className="h-full p-4">
      <h2 className=" font-semibold text-gray-800 mb-4">{name}</h2>
      <table className="w-full border-[#EEEEEE]   rounded-lg ">
        <thead>
          <tr className="border-b-2 border-[#EEEEEE] p-5">
            <th className="text-left pb-3 text-gray-600 font-medium text-sm">
              Product Name
            </th>
            <th className="text-right pb-3 text-gray-600 font-medium text-sm">
              {secondColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: any) => (
            <tr
              key={index}
              className="border-b border-[#EEEEEE] px-10 hover:bg-gray-50 transition-colors text-sm"
            >
              <td className="py-3 text-gray-800">{item.productName}</td>
              <td className="py-3 text-gray-800 text-right">
                {secondData[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
