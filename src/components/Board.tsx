'use client'

import { useBoardStore } from '@/store/BoardStore'
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import Column from './Column'

function Board() {
  const [board, getBoard] = useBoardStore(state => [state.board, state.getBoard])

  useEffect(() => {
    getBoard();
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            // sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {
              Array.from(board.columns.entries()).map(([columnId, column], index) => (
                <Column
                  key={columnId}
                  id={columnId}
                  todos={column.todos}
                  index={index}
                />
              ))
            }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board