import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Menu as MenuIcon, Info, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CategoryTableProps {
  categories: Category[];
  // menus: Menu[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onStatusToggle: (category: Category) => void;
  isLoading?: boolean;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onStatusToggle,
  isLoading,
}: CategoryTableProps) {
  const headers = ['S.No', 'Name', 'Description', 'Status', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        {' '}
        <Table>
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
                    <p className='text-lg font-medium'>Loading categories...</p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Please wait while we fetch the category data.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className='h-36 text-center align-middle'
                >
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='rounded-full bg-slate-100 p-3 mb-3'>
                      <MenuIcon className='h-6 w-6 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-medium'>No categories found</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Create a category to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => {
                return (
                  <TableRow key={category.id}>
                    <TableCell className='text-center font-mono text-sm'>
                      <span className='ml-5'>{index + 1}</span>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {category.name}
                    </TableCell>

                    <TableCell className='max-w-[300px] text-sm'>
                      {category.description ? (
                        <div className='flex items-center'>
                          <span className='truncate'>
                            {category.description}
                          </span>
                          {category.description.length > 40 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 ml-1'
                                >
                                  <Info className='h-3 w-3' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className='max-w-md'>
                                {category.description}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      ) : (
                        <span className='text-muted-foreground text-sm italic'>
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <Switch
                            checked={category.status}
                            onCheckedChange={() => onStatusToggle(category)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {category.status ? 'Deactivate' : 'Activate'}
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
                              onClick={() => onEdit(category)}
                              className='h-8 w-8 rounded-full hover:bg-gray-50 hover:text-gray-600'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Category</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onDelete(category)}
                              className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Category</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {/* The "No categories found" message is now handled within the table body */}
      </div>
    </TooltipProvider>
  );
}
