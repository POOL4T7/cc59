import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SubCategory {
  id: number;
  name: string;
  displayOrder: number;
}

interface Category {
  id: number;
  name: string;
  displayOrder: number;
  subCategoryIds: SubCategory[];
}

interface SelectedCategoryTreeProps {
  categorySelections: Category[];
  setCategorySelections: (
    categorySelections: Category[] | ((prev: Category[]) => Category[])
  ) => void;
}

function DragHandle() {
  return (
    <svg
      className='w-4 h-4 cursor-grab text-gray-400 hover:text-gray-600 mr-2'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 20 20'
    >
      <circle cx='7' cy='7' r='1.5' />
      <circle cx='7' cy='13' r='1.5' />
      <circle cx='13' cy='7' r='1.5' />
      <circle cx='13' cy='13' r='1.5' />
    </svg>
  );
}

function SortableItem({
  id,
  children,
  dragHandle,
}: {
  id: number | string;
  children: React.ReactNode;
  dragHandle?: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 999 : 'auto',
    boxShadow: isDragging ? '0 2px 12px 0 rgba(0,0,0,0.18)' : undefined,
    background: isDragging ? '#f5faff' : undefined,
    borderRadius: 8,
    marginBottom: 8,
  };
  return (
    <div ref={setNodeRef} style={style} className='flex items-center group'>
      <span {...attributes} {...listeners} className='flex items-center'>
        {dragHandle}
      </span>
      <div className='flex-1'>{children}</div>
    </div>
  );
}

export const SelectedCategoryTree: React.FC<SelectedCategoryTreeProps> = ({
  categorySelections,
  setCategorySelections,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  // Handler for category drag end
  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Sort by displayOrder before moving
    const sorted = [...categorySelections].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
    const oldIndex = sorted.findIndex((cat) => cat.id === active.id);
    const newIndex = sorted.findIndex((cat) => cat.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newArr = arrayMove(sorted, oldIndex, newIndex).map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));
    setCategorySelections(newArr);
  };

  // Handler for subcategory drag end
  const handleSubCategoryDragEnd =
    (categoryId: number) => (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setCategorySelections((prev: Category[]) =>
        prev.map((cat: Category) => {
          if (cat.id !== categoryId) return cat;
          // Sort by displayOrder before moving
          const sortedSubs = [...cat.subCategoryIds].sort(
            (a, b) => a.displayOrder - b.displayOrder
          );
          const oldIndex = sortedSubs.findIndex((sub) => sub.id === active.id);
          const newIndex = sortedSubs.findIndex((sub) => sub.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return cat;
          const newSubs = arrayMove(sortedSubs, oldIndex, newIndex).map(
            (sub, idx) => ({ ...sub, displayOrder: idx + 1 })
          );
          return { ...cat, subCategoryIds: newSubs };
        })
      );
    };

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <button
        className='w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
      >
        <div className='flex items-center space-x-2'>
          <span className='font-medium text-gray-900'>
            Selected Sub Categories
          </span>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            {categorySelections.reduce(
              (acc: number, cat: Category) => acc + cat.subCategoryIds.length,
              0
            )}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      {isExpanded && (
        <div className='p-4 space-y-3'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCategoryDragEnd}
          >
            <SortableContext
              items={categorySelections
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((cat) => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              {categorySelections
                .slice()
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((cat, idx, arr) => (
                  <React.Fragment key={cat.id}>
                    <SortableItem id={cat.id} dragHandle={<DragHandle />}>
                      <div className='flex items-center gap-2'>
                        <span className='rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold'>
                          {cat.displayOrder}
                        </span>
                        <span className='font-medium text-gray-900'>
                          {cat.name}
                        </span>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleSubCategoryDragEnd(cat.id)}
                      >
                        <SortableContext
                          items={cat.subCategoryIds
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((sub) => sub.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className='flex flex-wrap gap-2 mt-2'>
                            {cat.subCategoryIds
                              .slice()
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((sub) => (
                                <SortableItem
                                  key={sub.id}
                                  id={sub.id}
                                  dragHandle={<DragHandle />}
                                >
                                  <span className='flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200 transition'>
                                    <span className='rounded bg-gray-200 text-gray-700 px-1.5 py-0.5 text-xs font-semibold'>
                                      {sub.displayOrder}
                                    </span>
                                    <span>{sub.name}</span>
                                  </span>
                                </SortableItem>
                              ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </SortableItem>
                    {idx < arr.length - 1 && (
                      <hr className='my-2 border-gray-200' />
                    )}
                  </React.Fragment>
                ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
