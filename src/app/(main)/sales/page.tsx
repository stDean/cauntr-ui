import { Card } from '@/components/MiniCard'
import { SalesTable } from '@/components/table/SalesTable';
import React from 'react'
import { Data } from './Data';

export default function page() {

    const cardData = ({
        text1,
        text2,
        text3,
      }: {
        text1: string;
        text2: string;
        text3: string;
      }): any[] => {
        return [
          {
            title: "Inventory Value",
            subText: `${text1}`,
          },
          {
            title: "Total Stock Count",
            subText: (
              <p className="text-xl mt-3 md:mt-5 font-semibold">
                {text2}
                <span className="font-normal! text-base! ml-1">items</span>
              </p>
            ),
          },
          {
            title: "Categories",
            subText: `${text3}`,
          },
          {
            title: "Top Selling Product",
            subText: "MacBook Pro",
          },
        ];
      };


    const cardDetails = cardData({
        text1: "1000",
        text2: "200",
        text3: "5",
      });
      
  return (
    <div className='px-4 mb-18 lg:mb-2'>
        <Card  cardData={cardDetails}/>
        <SalesTable data = {Data}/>
    </div>
  )
}
