'use client'

import { useBoardStore } from '@/store/BoardStore'
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import Column from './Column'

function Board() {
  const [board, getBoard, setBoardState] = useBoardStore(state => [state.board, state.getBoard, state.setBoardState])

  useEffect(() => {
    getBoard();
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

    // Do nothing if dropped outside the list
    if (!destination) return

    // Handle reordering of columns
    if (type === "column") {
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      setBoardState({ ...board, columns: rearrangedColumns })
    }

    // This step is necessary because we need to update the columnId of the todo
    const columns = Array.from(board.columns)
    const startColIndex = columns[Number(source.droppableId)]
    const finishColIndex = columns[Number(destination.droppableId)]

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }

    if (!startCol || !finishCol) return

    if (source.index === destination.index && startCol === finishCol) return

    // const newTodos = startCol.todos.filter((_, idx) => idx !== source.index)
    const newTodos = startCol.todos
    const [removed] = newTodos.splice(source.index, 1)
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