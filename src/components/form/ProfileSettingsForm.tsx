import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '../ui/form'
import { CustomInput } from './ui/CustomInput'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { ProfileSettingSchema } from '@/schema'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

export const ProfileSettingsForm = () => {
    const [canEdit, setCanEdit] = useState<boolean>(false)

     const form = useForm<z.infer<typeof ProfileSettingSchema>>({
        resolver: zodResolver(ProfileSettingSchema),
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "company@company.com",
          role: "",
          password: "",
        },
      });

    const onSubmit = (data: z.infer<typeof ProfileSettingSchema>) => {
        console.log(data)
    }


  const handleCancel = () => {
    form.reset(); 
    setCanEdit(false);
  };

  return (
     <Form {...form}> 
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border rounded-lg px-6 py-8 w-full md:w-2xl space-y-5 shadow-lg">
            <div className="flex justify-between items-center">
            <h1 className="font-semibold text-2xl">Profile</h1>

            {!canEdit && (
              <Button
                className="cursor-pointer"
                onClick={() => { 
                  setCanEdit(true);
                }}
                variant={"cauntr_blue"}
              >
                <Pencil className="mr-2" /> Edit
              </Button>
            )}
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <CustomInput
                control={form.control}
              label="First Name"
              name="firstName"
              placeholder="First Name"
              disabled={!canEdit}
            />
            <CustomInput
                control={form.control}
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
              disabled={!canEdit}
            />
          </div>
          <CustomInput
                control={form.control}
              label="Email"
              name="email"
              placeholder="johndoe@gmail.com"
              disabled={!canEdit}
            />
            <CustomInput
                control={form.control}
              label="Role"
              name="role"
              placeholder="Admin"
              disabled={!canEdit}
            />
            {!canEdit && (<CustomInput
                control={form.control}
              label="Password"
              name="password"
              placeholder="********"
              disabled={!canEdit}
              
            />)}
            {canEdit && (
                <div className='space-y-2'>
                    <p className='text-[12px]'>Password</p>
                    <Button
                className="cursor-pointer border-blue-500 text-blue-500"
                variant={"outline"}
                onClick={() => {
                    console.log('Pop up a modal to Change Password')
                }}
                >Change Password</Button>
                </div>
            )}

{canEdit && (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={handleCancel}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant={"cauntr_blue"}
                type="submit"
                className="cursor-pointer"
              >
                Save
              </Button>
            </div>
          )}

            </div>
        </form>
     </Form>
  )
}
