import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Package, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatPrice } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  subCategories: SubCategory[];
  categories: Category[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onStatusToggle: (product: Product, status: boolean) => void;
}

export function ProductTable({
  products,

  onEdit,
  onDelete,
  onStatusToggle,
  isLoading,
}: ProductTableProps) {
  const headers = [
    'S.No',
    'Name',
    'Sub Category',
    'Category',
    'Price',
    'Status',
    'Actions',
  ];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <Table className='min-w-full divide-y divide-gray-200'>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className='h-24 text-center'
                >
                  <div className='flex flex-col items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary mb-3' />
                    <p className='text-lg font-medium'>Loading products...</p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Please wait while we fetch the product data.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className='h-36 text-center align-middle'
                >
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='rounded-full bg-slate-100 p-3 mb-3'>
                      <Package className='h-6 w-6 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-medium'>No products found</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Create a product to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell className='text-center font-mono text-sm'>
                      <span className='ml-5'>{index + 1}</span>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {product.name}
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>{product.subCategoryName}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <Switch
                            checked={product.status}
                            onCheckedChange={(checked) =>
                              onStatusToggle(product, checked)
                            }
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {product.status ? 'Deactivate' : 'Activate'}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onEdit(product)}
                              className='h-8 w-8 rounded-full hover:bg-gray-50 hover:text-gray-600'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Product</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onDelete(product)}
                              className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Product</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
