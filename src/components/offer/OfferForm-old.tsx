// 'use client';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Switch } from '@/components/ui/switch';
// import { X, Plus } from 'lucide-react';
// import React from 'react';
// import { Offer, Item } from '@/types/offer';

// // Match the Offer/Item types (createdAt/updatedAt optional for form, required in final object)
// const itemSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1, 'Required'),
//   price: z.coerce.number().min(0, 'Must be non-negative'),
//   image: z.string(),
//   description: z.string(),
//   createdAt: z.any().optional(),
//   updatedAt: z.any().optional(),
//   status: z.boolean(),
// });

// const offerSchema = z.object({
//   id: z.number().optional(),
//   name: z.string().min(1, 'Required'),
//   description: z.string().min(1, 'Required'),
//   startDate: z.string().min(1, 'Required'),
//   endDate: z.string().min(1, 'Required'),
//   discountPercentage: z.coerce.number().min(0).max(100),
//   status: z.boolean(),
//   createdAt: z.any().optional(),
//   updatedAt: z.any().optional(),
//   drinks: z.array(itemSchema),
//   foods: z.array(itemSchema),
// });

// export type OfferFormValues = z.infer<typeof offerSchema>;

// interface OfferFormProps {
//   offer: Offer;
//   // onChange: (offer: Offer) => void;
//   onSubmit: (offer: OfferFormValues) => void;
//   onCancel: () => void;
//   editing: boolean;
// }

// const emptyItem = (): Item => ({
//   id: Date.now(),
//   name: '',
//   price: 0,
//   image: '',
//   description: '',
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   status: true,
// });

// const OfferForm: React.FC<OfferFormProps> = ({
//   offer,
//   // onChange,
//   onSubmit,
//   onCancel,
//   editing,
// }) => {
//   const form = useForm<OfferFormValues>({
//     resolver: zodResolver(offerSchema),
//     defaultValues: {
//       ...offer,
//       startDate: offer.startDate
//         ? new Date(offer.startDate).toISOString().split('T')[0]
//         : '',
//       endDate: offer.endDate
//         ? new Date(offer.endDate).toISOString().split('T')[0]
//         : '',
//       drinks: offer.drinks || [],
//       foods: offer.foods || [],
//     },
//     mode: 'onChange',
//   });

//   const drinksArray = useFieldArray({
//     control: form.control,
//     name: 'drinks',
//   });

//   const foodsArray = useFieldArray({
//     control: form.control,
//     name: 'foods',
//   });

//   // Call onChange for live preview if needed
//   // React.useEffect(() => {
//   //   onChange(form.getValues() as Offer);
//   // }, [form.watch()]);

//   const handleSubmit = form.handleSubmit((data) => {
//     onSubmit(data);
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={handleSubmit} className='space-y-4'>
//         <FormField
//           control={form.control}
//           name='name'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='description'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className='flex gap-4'>
//           <FormField
//             control={form.control}
//             name='startDate'
//             render={({ field }) => (
//               <FormItem className='flex-1'>
//                 <FormLabel>Start Date</FormLabel>
//                 <FormControl>
//                   <Input type='date' {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name='endDate'
//             render={({ field }) => (
//               <FormItem className='flex-1'>
//                 <FormLabel>End Date</FormLabel>
//                 <FormControl>
//                   <Input type='date' {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <FormField
//           control={form.control}
//           name='discountPercentage'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Discount %</FormLabel>
//               <FormControl>
//                 <Input type='number' min={0} max={100} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='status'
//           render={({ field }) => (
//             <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
//               <div className='space-y-0.5'>
//                 <FormLabel className='text-base'>Status</FormLabel>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <div>
//           <h4 className='font-semibold mb-2'>Drinks</h4>
//           {drinksArray.fields.map((field, idx) => (
//             <div
//               key={field.id}
//               className='border p-4 mb-4 rounded-lg space-y-4'
//             >
//               <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
//                 <FormField
//                   control={form.control}
//                   name={`drinks.${idx}.name`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`drinks.${idx}.price`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input type='number' {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`drinks.${idx}.image`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Image URL</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`drinks.${idx}.status`}
//                   render={({ field }) => (
//                     <FormItem className='flex flex-col justify-end'>
//                       <FormLabel>Status</FormLabel>
//                       <FormControl>
//                         <Switch
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name={`drinks.${idx}.description`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className='flex justify-end'>
//                 <Button
//                   type='button'
//                   variant='destructive'
//                   size='sm'
//                   onClick={() => drinksArray.remove(idx)}
//                 >
//                   <X className='h-4 w-4 mr-2' />
//                   Remove Drink
//                 </Button>
//               </div>
//             </div>
//           ))}
//           <Button
//             type='button'
//             variant='outline'
//             onClick={() => drinksArray.append(emptyItem())}
//             className='mt-2'
//           >
//             <Plus className='mr-2 h-4 w-4' />
//             Add Drink
//           </Button>
//         </div>
//         <div>
//           <h4 className='font-semibold mb-2'>Foods</h4>
//           {foodsArray.fields.map((field, idx) => (
//             <div
//               key={field.id}
//               className='border p-4 mb-4 rounded-lg space-y-4'
//             >
//               <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
//                 <FormField
//                   control={form.control}
//                   name={`foods.${idx}.name`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`foods.${idx}.price`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input type='number' {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`foods.${idx}.image`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Image URL</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`foods.${idx}.status`}
//                   render={({ field }) => (
//                     <FormItem className='flex flex-col justify-end'>
//                       <FormLabel>Status</FormLabel>
//                       <FormControl>
//                         <Switch
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name={`foods.${idx}.description`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className='flex justify-end'>
//                 <Button
//                   type='button'
//                   variant='destructive'
//                   size='sm'
//                   onClick={() => foodsArray.remove(idx)}
//                 >
//                   <X className='h-4 w-4 mr-2' />
//                   Remove Food
//                 </Button>
//               </div>
//             </div>
//           ))}
//           <Button
//             type='button'
//             variant='outline'
//             onClick={() => foodsArray.append(emptyItem())}
//             className='mt-2'
//           >
//             <Plus className='mr-2 h-4 w-4' />
//             Add Food
//           </Button>
//         </div>
//         <div className='flex gap-2 justify-end mt-4'>
//           <Button type='submit'>
//             {editing ? 'Update Offer' : 'Create Offer'}
//           </Button>
//           <Button type='button' variant='outline' onClick={onCancel}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default OfferForm;

import React from 'react';

const OfferFormOld = () => {
  return <div>OfferFormOld</div>;
};

export default OfferFormOld;
