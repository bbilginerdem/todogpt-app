'use client'

import { XCircleIcon } from '@heroicons/react/24/solid';
import React from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps
}: Props) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 hover:text-red-600">
          <XCircleIcon className="h-7 w-7 ml-5" />
        </button>
      </div>

      {/* Add image */}
    </div>
  )
}

export default TodoCard