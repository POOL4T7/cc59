import { useState, useEffect } from 'react';
import { getAllMenus } from '@/lib/menu-api';
import { getAllCategories } from '@/lib/categories-api';
import { getAllSubCategories } from '@/lib/sub-categories-api';
import { Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';

export function useFetchMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | unknown>(null);

  useEffect(() => {
    async function fetchMenus() {
      setLoading(true);
      try {
        const data = await getAllMenus();
        setMenus(
          (data?.data || []).map((menu: Menu) => ({
            ...menu,
            status:
              typeof menu.status === 'boolean'
                ? menu.status
                : menu.status === 'active',
          }))
        );
      } catch (err: Error | unknown) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenus();
  }, []);

  return { menus, loading, error };
}

export function useFetchCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | unknown>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(
          (data?.data || []).map((cat: Category) => ({
            ...cat,
            status:
              typeof cat.status === 'boolean'
                ? cat.status
                : cat.status === 'active',
          }))
        );
      } catch (err: Error | unknown) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useFetchSubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | unknown>(null);

  useEffect(() => {
    async function fetchSubCategories() {
      setLoading(true);
      try {
        const data = await getAllSubCategories();
        setSubCategories(data?.data || []);
      } catch (err: Error | unknown) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubCategories();
  }, []);

  return { subCategories, loading, error };
}
