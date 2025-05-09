'use client';
import { Offer } from '@/types/offer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Gift, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// import Image from 'next/image';
import React from 'react';
import { formatPrice } from '@/lib/utils';

interface OfferTableProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
  // onReorder?: (oldIndex: number, newIndex: number) => void; // Removed as it's not used in normal table
  onStatusToggle?: (offer: Offer, status: boolean) => void;
  isLoading?: boolean;
}

export function OfferTable({
  offers,
  onEdit,
  onDelete,
  onStatusToggle,
  isLoading,
}: OfferTableProps) {
  const headers = [
    'S.No',
    'Name',

    // 'Offer Image',
    // 'Description',
    'Food Info',
    'Food Price',
    'Drink Info',
    'Drink Price',
    'Status',
    'Actions',
  ];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
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
                  className='h-36 text-center align-middle'
                >
                  <div className='flex flex-col items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary mb-3' />
                    <p className='text-lg font-medium'>Loading offers...</p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Please wait while we fetch the offer data.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className='h-36 text-center align-middle'
                >
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='rounded-full bg-slate-100 p-3 mb-3'>
                      <Gift className='h-6 w-6 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-medium'>No offers found</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Create an offer to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer, index) => (
                <TableRow key={String(offer.id)}>
                  <TableCell className='text-center font-mono text-sm'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='font-medium'>{offer.name}</TableCell>
                  <TableCell className='truncate max-w-xs'>
                    {offer.foodItemsInfo}
                  </TableCell>
                  <TableCell>
                    {formatPrice(Number(offer.foodItemsPrice))}
                  </TableCell>
                  <TableCell className='truncate max-w-xs'>
                    {offer.drinkItemsInfo}
                  </TableCell>
                  <TableCell>
                    {formatPrice(Number(offer.drinkItemsPrice))}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <Switch
                          checked={!!offer.isActive}
                          onCheckedChange={
                            onStatusToggle
                              ? (checked) => onStatusToggle(offer, checked)
                              : undefined
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {offer.isActive ? 'Deactivate' : 'Activate'}
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
                            onClick={() => onEdit(offer)}
                            className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Offer</TooltipContent>
                      </Tooltip>
                      {onDelete && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onDelete(offer)}
                              className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Offer</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}

export default OfferTable;
