import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
  id: string;
  children: React.ReactNode;
  isDragDisabled?: boolean;
}

export function DraggableRow({ id, children, isDragDisabled }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className='w-[50px] p-2'>
        <button
          className={
            isDragDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-grab hover:cursor-grabbing focus:outline-none'
          }
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4 text-gray-500' />
        </button>
      </td>
      {children}
    </tr>
  );
}
