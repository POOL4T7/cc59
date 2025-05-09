'use client';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
// import { toast } from 'sonner';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';

import { Product } from '@/types/product';
// import { Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import { subCategoryByCategoryId } from '@/lib/sub-categories-api';
import { getProductById, uploadProductImage } from '@/lib/products-api';

// Update ProductFormValues to match schema and Product type
export type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  subCategoryId: number;
  tagLine?: string;
  metadata?: string;
  allergies?: string;
  status: boolean;
  tags?: string[];
  ingredients?: string[];
  itemsImagePaths?: string[];
  image?: string;
};

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be non-negative' }),
  categoryId: z.coerce.number({ required_error: 'Please select a category' }),
  subCategoryId: z.coerce.number({
    required_error: 'Please select a sub-category',
  }),
  tagLine: z.string().optional(),
  metadata: z.string().optional(),
  allergies: z.string().optional(),
  status: z.boolean(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  itemsImagePaths: z.array(z.string()).optional(),
});

type ProductFormProps = {
  // menus: Menu[];
  categories: Category[];
  subCategories: SubCategory[];
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
};

export function ProductForm({
  // menus,
  categories,
  initialData,
  onSubmit,
}: ProductFormProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.itemsImagePaths || []
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || 0,
      subCategoryId: initialData?.subCategoryId || 0,
      tagLine: initialData?.tagLine || '',
      metadata: initialData?.metadata || '',
      allergies: initialData?.allergies || '',
      status: initialData?.status || false,
      tags: initialData?.tags || [],
      ingredients: initialData?.ingredients || [],
      itemsImagePaths: initialData?.itemsImagePaths || [],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: 'tags' as never,
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: 'ingredients' as never,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (initialData?.id) {
        const { data: product } = await getProductById(initialData.id);
        form.setValue('name', product.name);
        form.setValue('description', product.description);
        form.setValue('price', product.price);
        form.setValue('status', product.status);
        form.setValue('tags', product.tags || []);
        form.setValue('ingredients', product.ingredients || []);
        form.setValue('itemsImagePaths', product.itemsImagePaths || []);
        form.setValue('tagLine', product.tagLine || '');
        form.setValue('metadata', product.metadata || '');
        form.setValue('allergies', product.allergies || '');
        form.setValue('categoryId', initialData?.categoryId);
        form.setValue('subCategoryId', initialData?.subCategoryId);
        setImageUrls(product.itemsImagePaths || []);
      }
    };
    fetchData();
  }, [initialData?.id]);

  useEffect(() => {
    async function fetchSubCategories() {
      const subCategories = await subCategoryByCategoryId(
        String(form.watch('categoryId'))
      );

      setSubCategories(subCategories?.data || []);
    }
    if (form.watch('categoryId') !== 0) {
      fetchSubCategories();
    }
  }, [form.watch('categoryId')]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    console.log(files);
    const newImageFiles = Array.from(files);
    console.log('Selected Files:', newImageFiles);
    const res = await uploadProductImage(
      newImageFiles,
      initialData?.id?.toString() || ''
    );

    const newImageUrls = newImageFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
    setImageUrls((prev) => [...prev, ...res.data]);
    form.setValue('itemsImagePaths', [...imageUrls, ...res.data]);

    // Cleanup object URLs to prevent memory leaks
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedFiles = imageFiles.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);

    // Revoke the object URL for the removed image
    URL.revokeObjectURL(imageUrls[indexToRemove]);

    setImageFiles(updatedFiles);
    setImageUrls(updatedUrls);
    form.setValue('itemsImagePaths', updatedUrls);
  };

  const handleSubmit: SubmitHandler<ProductFormValues> = (values) => {
    // Prepare data for submission
    const submissionData = {
      name: values.name.trim(),
      description: values.description?.trim() || '',
      price: Number(values.price),
      categoryId: values.categoryId,
      subCategoryId: values.subCategoryId,
      tagLine: values.tagLine?.trim() || '',
      metadata: values.metadata?.trim() || '',
      allergies: values.allergies?.trim() || '',
      status: values.status,
      tags: values.tags?.filter((tag) => tag.trim() !== '') || [],
      ingredients:
        values.ingredients?.filter((ingredient) => ingredient.trim() !== '') ||
        [],
      itemsImagePaths: imageUrls.filter((url) => url.trim() !== ''),
    };
    console.log('submissionData', submissionData);
    onSubmit(submissionData);
    // toast.success(`${initialData ? 'Product updated' : 'Product created'}!`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Categorization */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='subCategoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-Category</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select sub-category' />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Basic Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter item name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (€)</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Enter description' {...field} />
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
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          <FormField
            control={form.control}
            name='allergies'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter allergy information'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <div className='mb-4'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center gap-4'>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span>{field.value ? 'Active' : 'Inactive'}</span>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tags & Ingredients */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <FormLabel>Product Tags</FormLabel>
            <div className='space-y-2'>
              {tagFields.map((field, index) => (
                <div key={field.id} className='flex items-center space-x-2'>
                  <FormControl>
                    <Input
                      placeholder='Enter tag'
                      {...form.register(`tags.${index}` as const)}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={() => removeTag(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => appendTag('')}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Tag
              </Button>
            </div>
          </div>
          <div>
            <FormLabel>Ingredients</FormLabel>
            <div className='space-y-2'>
              {ingredientFields.map((field, index) => (
                <div key={field.id} className='flex items-center space-x-2'>
                  <FormControl>
                    <Input
                      placeholder='Enter ingredient'
                      {...form.register(`ingredients.${index}` as const)}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={() => removeIngredient(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => appendIngredient('')}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Ingredient
              </Button>
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <FormLabel>Product Images</FormLabel>
          <div className='space-y-2'>
            <Input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full'
            />
            <div className='grid grid-cols-3 gap-2 mt-2'>
              {imageUrls.map((url, index) => (
                <div key={index} className='relative w-full h-24'>
                  <Image
                    src={process.env.NEXT_PUBLIC_SERVER_URL + url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className='object-cover rounded'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-0 right-0 m-1'
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type='submit' className='w-full mt-6'>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
