import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

type Props = {
  id: TypedColumn,
  todos: Todo[],
  index: number
}

function Column({ id, todos, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>{
      (provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render internal droppable todos in the column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, spanShot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm ${spanShot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}
              >

              </div>
            )}
          </Droppable>
        </div>
      )
    }</Draggable>
  )
}

export default Column