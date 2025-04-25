import React from 'react'
import { StockDataProps } from '@/lib/types'

interface Props {
    data : StockDataProps[];
    name : string;
    secondColumn : string;
    secondData : any;
}


export const StockDataTable = ({data , name , secondColumn , secondData} : Props ) => {
  return (
    <div className=" rounded-lg border border-[#EEEEEE] p-2">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {name}
    </h2>
    <table className="w-full border-[#EEEEEE]   rounded-lg ">
      <thead >
        <tr className="border-b-2 border-[#EEEEEE] p-5">
          <th className="text-left pb-3 text-gray-600 font-medium">Product Name</th>
          <th className="text-right pb-3 text-gray-600 font-medium">{secondColumn}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item : any , index : any) => (
          <tr 
            key={index}
            className="border-b border-[#EEEEEE] px-10 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 text-gray-800">{item.productName}</td>
            <td className="py-3 text-gray-800 text-right">{secondData[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}
