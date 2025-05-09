'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { Offer } from '@/types/offer';
import { uploadOfferImage } from '@/lib/offer-api';
import Image from 'next/image';

const offerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Required'),
  foodItemsInfo: z.string(),
  foodItemsPrice: z.string(),
  foodItemsImagePaths: z.array(z.string()),
  drinkItemsInfo: z.string(),
  drinkItemsPrice: z.string(),
  drinkItemsImagePaths: z.array(z.string()),
  offerImagePath: z.string().nullable(),
  description: z.string().min(1, 'Required'),
  tagLine: z.string().optional(),
  metadata: z.string().optional(),
  isActive: z.boolean(),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  offer: Offer;
  onSubmit: (offer: OfferFormValues) => void;
  onCancel: () => void;
  editing: boolean;
}

const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  onSubmit,
  onCancel,
  editing,
}) => {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      ...offer,
      tagLine: offer.tagLine || '',
      metadata: offer.metadata || '',
      foodItemsImagePaths: offer.foodItemsImagePaths || [],
      drinkItemsImagePaths: offer.drinkItemsImagePaths || [],
      offerImagePath: offer.offerImagePath || null,
      isActive: offer.isActive || false,
    },
    mode: 'onChange',
  });

  // Remove image by index
  const removeImage = (
    type: 'foodItemsImagePaths' | 'drinkItemsImagePaths',
    idx: number
  ) => {
    const current = form.getValues(type) || [];
    form.setValue(
      type,
      current.filter((_: string, i: number) => i !== idx)
    );
  };

  // Remove offer image
  const removeOfferImage = () => {
    form.setValue('offerImagePath', null);
  };

  // Handle file input for food images
  const handleFoodImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = await uploadOfferImage(files, 'food');
    const prev = form.getValues('foodItemsImagePaths') || [];
    form.setValue('foodItemsImagePaths', [...prev, ...urls]);
    e.target.value = '';
  };

  // Handle file input for drink images
  const handleDrinkImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = await uploadOfferImage(files, 'drink');
    const prev = form.getValues('drinkItemsImagePaths') || [];
    form.setValue('drinkItemsImagePaths', [...prev, ...urls]);
    e.target.value = '';
  };

  // Handle file input for offer image (single)
  const handleOfferImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = await uploadOfferImage(files, 'offer');
    form.setValue('offerImagePath', urls[0] || null);
    e.target.value = '';
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Offer name' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Write a short description...'
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tagLine'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder='Enter tagline' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='metadata'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metadata</FormLabel>
              <FormControl>
                <Textarea placeholder='Enter metadata' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Offer Image Upload */}
        <div>
          <FormLabel>Offer Image</FormLabel>
          <label className='block w-fit cursor-pointer px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50'>
            <span>Select Image</span>
            <input
              type='file'
              accept='image/*'
              onChange={handleOfferImageChange}
              className='hidden'
            />
          </label>
          {form.watch('offerImagePath') && (
            <div className='relative mt-2'>
              <Image
                src={
                  process.env.NEXT_PUBLIC_SERVER_URL +
                  (form.watch('offerImagePath') || '')
                }
                alt='Offer'
                width={80}
                height={80}
                className='w-20 h-20 object-cover rounded border'
              />
              <button
                type='button'
                className='absolute top-0 right-0 bg-white bg-opacity-80 text-red-600 rounded-full p-1 shadow hover:bg-opacity-100'
                onClick={removeOfferImage}
                aria-label='Remove image'
              >
                ×
              </button>
            </div>
          )}
        </div>
        {/* Food Items Section */}
        <div className='p-4 rounded-lg border bg-gray-50'>
          <h3 className='font-semibold text-lg mb-4 text-gray-700'>
            Food Items
          </h3>
          <FormField
            control={form.control}
            name='foodItemsInfo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Items Info</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Describe the food items...'
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='foodItemsPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Items Price (€)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Price (comma separated for multiple)'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>Food Item Images</FormLabel>
          <label className='block w-fit cursor-pointer px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50'>
            <span>Select Images</span>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handleFoodImagesChange}
              className='hidden'
            />
          </label>
          <div className='flex gap-2 mt-2'>
            {(form.watch('foodItemsImagePaths') || []).map((src, idx) => (
              <div key={idx} className='relative'>
                <Image
                  src={process.env.NEXT_PUBLIC_SERVER_URL + src}
                  alt={`Food Item Preview ${idx + 1}`}
                  width={80}
                  height={80}
                  className='w-20 h-20 object-cover rounded border'
                />
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-white bg-opacity-80 text-red-600 rounded-full p-1 shadow hover:bg-opacity-100'
                  onClick={() => removeImage('foodItemsImagePaths', idx)}
                  aria-label='Remove image'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Drink Items Section */}
        <div className='p-4 rounded-lg border bg-gray-50'>
          <h3 className='font-semibold text-lg mb-4 text-gray-700'>
            Drink Items
          </h3>
          <FormField
            control={form.control}
            name='drinkItemsInfo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drink Items Info</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Describe the drink items...'
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='drinkItemsPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drink Items Price (€)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Price (comma separated for multiple)'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>Drink Item Images</FormLabel>
          <label className='block w-fit cursor-pointer px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50'>
            <span>Select Images</span>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handleDrinkImagesChange}
              className='hidden'
            />
          </label>
          <div className='flex gap-2 mt-2'>
            {(form.watch('drinkItemsImagePaths') || []).map((src, idx) => (
              <div key={idx} className='relative'>
                <Image
                  src={process.env.NEXT_PUBLIC_SERVER_URL + src}
                  alt={`Drink Item Preview ${idx + 1}`}
                  width={80}
                  height={80}
                  className='w-20 h-20 object-cover rounded border'
                />
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-white bg-opacity-80 text-red-600 rounded-full p-1 shadow hover:bg-opacity-100'
                  onClick={() => removeImage('drinkItemsImagePaths', idx)}
                  aria-label='Remove image'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col md:flex-row md:items-center gap-4'>
          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center gap-2'>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>{editing ? 'Update' : 'Create'} Offer</Button>
        </div>
      </form>
    </Form>
  );
};

export default OfferForm;
