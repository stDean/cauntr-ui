import { TabNavigation } from '@/components/TabNavigation';
import { CustomersTable } from '@/components/table/CustomersTable';
import { DebtorsTable } from '@/components/table/DebtorsTable';
import {SuppliersTable} from '@/components/table/SuppliersTable'
import {suppliersData , customersData , debtorsData} from './data'
import React from 'react'

const UsersContent = ( {tab} : {tab : string}) => {

    const tabs = [
        { label: "Suppliers", query: "suppliers" },
        { label: "Customers", query: "customers" },
        { label: "Debtors", query: "debtors" },
      ];

      

  return (
    <div className='px-4 mb-18 lg:mb-2 space-y-5'>
        <p className='ml-5 mt-2 text-sm font-bold'>Manage Users</p>

         <TabNavigation activeTab={tab} basePath="/users" tabs={tabs} />
         
          <div className="mt-4 px-4 mb-18 lg:my-4">
                 {tab === "suppliers" && (
                   <SuppliersTable  data={suppliersData}/>)}
         
                   {tab === "customers" && <CustomersTable  data = {customersData} />}
                 {tab === "debtors" && <DebtorsTable  data={debtorsData} />}
               </div>

    </div>
  )
}

export default UsersContent