'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Categories, Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subCategoryByCategoryId } from '@/lib/sub-categories-api';
import { getMenuById } from '@/lib/menu-api';
import { SelectedCategoryTree } from './SelectedCategoryTree';
import {
  // addMenuEntries,
  getMenuEntries,
  updateMenuEntries,
} from '@/lib/categories-api';
import { generateSlug } from '@/lib/utils';

const menuSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters' }),
  description: z.string().optional(),
  tagLine: z.string().optional(),
  metadata: z.string().optional(),
  status: z.boolean(),
  displayOrder: z.coerce
    .number()
    .min(1, { message: 'Display order must be at least 1' }),
});

interface MenuFormProps {
  onSubmitBasic: (data: Menu) => Promise<Menu>;
  onCancel?: () => void;
  loading?: boolean;
  categories: Category[];
  menuId?: string;
}

export function MenuForm({
  onSubmitBasic,
  onCancel,
  loading,
  categories,
  menuId: oldMenuId,
}: MenuFormProps) {
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: true,
      displayOrder: 1,
      metadata: '',
      tagLine: '',
    },
  });

  const nameValue = form.watch('name');

  useEffect(() => {
    if (nameValue) {
      const generatedSlug = generateSlug(nameValue);
      form.setValue('slug', generatedSlug);
    }
  }, [nameValue, form]);

  const [step, setStep] = useState<'basic' | 'category'>('basic');
  const [menuId, setMenuId] = useState(oldMenuId || '');

  const handleSubmitBasic = async (values: z.infer<typeof menuSchema>) => {
    const res = await onSubmitBasic({
      ...values,
      id: menuId || '',
      description: values.description || '',
      slug: values.slug || '',
      tagLine: values.tagLine || '',
      metadata: values.metadata || '',
    });
    console.log(res);
    setMenuId(res.id);
    toast.success('Menu details saved!');
    setStep('category');
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categorySelections, setCategorySelections] = useState<
    {
      id: number;
      name: string;
      displayOrder: number;
      subCategoryIds: {
        id: number;
        name: string;
        displayOrder: number;
      }[];
    }[]
  >([]);
  const [fetchedSubCategories, setFetchedSubCategories] = useState<
    SubCategory[]
  >([]);
  // const [isEntitesAdded, setIsEntitesAdded] = useState(false);

  useEffect(() => {
    if (!selectedCategoryId) {
      setFetchedSubCategories([]);
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const data = await subCategoryByCategoryId(selectedCategoryId);
        setFetchedSubCategories(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
        setFetchedSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    if (oldMenuId) {
      const fetchMenuById = async () => {
        try {
          const data = await getMenuById(oldMenuId);
          const categoriesResponse = await getMenuEntries(oldMenuId);

          form.setValue('name', data?.data?.name || '');
          form.setValue('description', data?.data?.description || '');
          form.setValue('status', data?.data?.status || true);
          form.setValue('displayOrder', data?.data?.displayOrder || 1);
          form.setValue('tagLine', data?.data?.tagLine || '');
          form.setValue('metadata', data?.data?.metadata || '');
          form.setValue('slug', data?.data?.slug || '');

          const initialSelections =
            categoriesResponse?.data?.categories?.map(
              (cat: Categories, catIdx: number) => {
                const categoryDisplayOrder = cat.displayOrder ?? catIdx + 1;

                const subCategoryIds =
                  cat.subCategories?.map((sub, subIdx) => ({
                    id: sub.id,
                    name: sub.name,
                    displayOrder: sub.displayOrder ?? subIdx + 1,
                  })) || [];

                return {
                  id: cat.id,
                  name: cat.name,
                  displayOrder: categoryDisplayOrder,
                  subCategoryIds,
                };
              }
            ) || [];
          console.log('initialSelections', initialSelections);

          setCategorySelections(initialSelections);
          setMenuId(oldMenuId || '');
        } catch (error) {
          console.error('Failed to fetch menu by id:', error);
        }
      };
      fetchMenuById();
    }
  }, [oldMenuId]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
  };

  const handleSubCategoryChange = (subCategoryId: number, checked: boolean) => {
    const cat = categories.find(
      (c) => Number(c.id) === Number(selectedCategoryId)
    );
    const sub = fetchedSubCategories.find((s) => s.id === subCategoryId);
    setCategorySelections((prev) => {
      const existing = prev.find(
        (sel) => sel.id === Number(selectedCategoryId)
      );
      if (existing) {
        const newSubIds = checked
          ? [
              ...existing.subCategoryIds,
              {
                id: subCategoryId,
                name: sub?.name || '',
                displayOrder: existing.subCategoryIds.length + 1,
              },
            ]
          : existing.subCategoryIds.filter((id) => id.id !== subCategoryId);
        if (newSubIds.length === 0) {
          return prev.filter((sel) => sel.id !== Number(selectedCategoryId));
        }
        return prev.map((sel) =>
          sel.id === Number(selectedCategoryId)
            ? { ...sel, subCategoryIds: newSubIds }
            : sel
        );
      } else {
        return [
          ...prev,
          {
            id: Number(selectedCategoryId),
            name: cat?.name || '',
            subCategoryIds: [
              {
                id: subCategoryId,
                name: sub?.name || '',
                displayOrder: 1,
              },
            ],
            displayOrder: prev.length + 1,
          },
        ];
      }
    });
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categorySelections.length === 0) return;

    const data = {
      categorySelections: categorySelections.map((cat) => ({
        categoryId: cat.id,
        displayOrder: cat.displayOrder,
        subCategories: cat.subCategoryIds.map((sub) => ({
          id: sub.id,
          displayOrder: sub.displayOrder,
        })),
      })),
      menuId: Number(menuId) || 0,
    };
    await updateMenuEntries(data);
    toast.success('Categories saved!');
    if (onCancel) onCancel();
  };

  return (
    <div className='space-y-6'>
      <Tabs
        value={step}
        onValueChange={(value) => setStep(value as 'basic' | 'category')}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='basic'>Basic Details</TabsTrigger>
          <TabsTrigger disabled={!menuId} value='category'>
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitBasic)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter menu name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter slug' {...field} />
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
                        placeholder='Enter description'
                        {...field}
                        className='min-h-[100px]'
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
                    <FormLabel>Tag Line</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter tag line' {...field} />
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
                      <Textarea
                        placeholder='Enter metadata'
                        {...field}
                        className='min-h-[100px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='displayOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter display order'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-4'>
                {onCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button type='submit' disabled={loading}>
                  {loading ? 'Saving...' : 'Save Menu'}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value='category'>
          <div>
            <form onSubmit={handleSubmitCategory} className='space-y-8'>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Category
                    </label>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={selectedCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {fetchedSubCategories.length > 0 && (
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium'>
                        Subcategories
                      </label>
                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                        {fetchedSubCategories.map((sub) => {
                          const checked =
                            categorySelections
                              .find(
                                (sel) => sel.id === Number(selectedCategoryId)
                              )
                              ?.subCategoryIds.some(
                                (subId) => subId.id === sub.id
                              ) || false;
                          return (
                            <div
                              key={sub.id}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={`sub-${sub.id}`}
                                checked={checked}
                                onCheckedChange={(checked) =>
                                  handleSubCategoryChange(
                                    sub.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={`sub-${sub.id}`}
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                {sub.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {categorySelections.length > 0 && (
                <div className='space-y-4'>
                  <SelectedCategoryTree
                    categorySelections={categorySelections}
                    setCategorySelections={setCategorySelections}
                  />
                </div>
              )}

              <div className='flex justify-end gap-4'>
                {onCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={loading || categorySelections.length === 0}
                >
                  {loading ? 'Saving...' : 'Save Categories'}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
