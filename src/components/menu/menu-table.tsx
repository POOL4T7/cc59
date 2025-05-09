'use client';

import { Menu } from '@/types/menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, MenuIcon, Info, Package, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

interface MenuTableProps {
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  // onReorder: (oldIndex: number, newIndex: number) => void; // Removed
  onStatusToggle: (menu: Menu) => void;
  isLoading?: boolean;
}

export function MenuTable({
  menus,
  onEdit,
  onDelete,
  onStatusToggle,
  isLoading,
}: MenuTableProps) {
  const headers = ['S.No', 'Name', 'Description', 'Status', 'Actions'];
  const router = useRouter();

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm '>
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
                  <div className='flex items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  </div>
                </TableCell>
              </TableRow>
            ) : menus?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className='h-24 text-center'
                >
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='rounded-full bg-slate-100 p-3 mb-3'>
                      <MenuIcon className='h-6 w-6 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-medium'>No menus found</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Create a menu to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              menus?.map((menu, index) => (
                <TableRow key={menu.id}>
                  <TableCell className='text-center font-mono text-sm'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='font-medium'>{menu.name}</TableCell>
                  <TableCell className='max-w-[300px]'>
                    {menu.description ? (
                      <div className='flex items-center'>
                        <span className='truncate'>{menu.description}</span>
                        {menu.description.length > 40 && (
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
                              {menu.description}
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
                          checked={menu.status}
                          onCheckedChange={() => onStatusToggle(menu)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {menu.status ? 'Deactivate' : 'Activate'}
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
                            onClick={() => onEdit(menu)}
                            className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Menu</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onDelete(menu)}
                            className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Menu</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => router.push(`/menu/${menu.id}`)}
                            className='h-8 w-8 rounded-full hover:bg-blue-50 text-muted-foreground hover:text-blue-600'
                          >
                            <Package className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Menu</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Removed the old conditional rendering for no menus as it's handled inside the table now */}
      </div>
    </TooltipProvider>
  );
}
