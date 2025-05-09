export type Product = {
  id: string;
  name: string;
  subCategoryId: number;
  subCategoryName?: string;
  description: string;
  status: boolean;

  price: number;
  categoryId: number;
  categoryName?: string;

  // New fields
  tags?: string[];
  ingredients?: string[];
  itemsImagePaths?: string[];
  allergies?: string;
  tagLine?: string;
  metadata?: string;
};

interface Category {
  id: number;
  name: string;
  description: string;
  imagePath: string | null;
  status: boolean;
  tagLine: string | null;
  metadata: string | null;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  imagePath: string | null;
  status: boolean;
  tagLine: string | null;
  metadata: string | null;
  categoryId: number;
}

interface Item {
  id: number;
  name: string;
  description: string;
  itemsImagePaths: string[] | null;
  price: number;
  status: boolean;
  allergies: string | null;
  tagLine: string | null;
  metadata: string | null;
  itemTags: string[] | null;
  ingredients: string[] | null;
}

export interface MenuProduct {
  menuId: number;
  menuName: string;
  category: Category;
  subCategory: SubCategory;
  item: Item;
  itemDisplayOrder: number;
  categoryDisplayOrder: number;
  subCategoryDisplayOrder: number;
  isActive: boolean;
}
