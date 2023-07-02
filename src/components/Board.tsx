'use client'

import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

function Board() {
  useEffect(() => {
    // getBoard();
  }, [])

  return (
    <DragDropContext>
      <Droppable droppableId="board" direction='horizontal' type="column">
        {(provided) => (
          <div className="board" {...provided.droppableProps} ref={provided.innerRef}>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board