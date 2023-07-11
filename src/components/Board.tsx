'use client'

import { useBoardStore } from '@/store/BoardStore'
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import Column from './Column'

function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(state => [state.board, state.getBoard, state.setBoardState, state.updateTodoInDB])

  useEffect(() => {
    getBoard();
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result
    // console.log("🚀 ~ file: Board.tsx:17 ~ handleOnDragEnd ~ result:", result)

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
    // console.log("🚀 ~ file: Board.tsx:33 ~ handleOnDragEnd ~ columns:", columns)

    const startColIndex = columns[Number(source.droppableId)]
    // console.log("🚀 ~ file: Board.tsx:35 ~ handleOnDragEnd ~ startColIndex:", startColIndex)
    const finishColIndex = columns[Number(destination.droppableId)]
    // console.log("🚀 ~ file: Board.tsx:37 ~ handleOnDragEnd ~ destination.droppableId:", destination.droppableId)
    // console.log("🚀 ~ file: Board.tsx:37 ~ handleOnDragEnd ~ finishColIndex:", finishColIndex)

    // const startTodoIndex = startColIndex[1].todos[source.index]
    // const finishTodoIndex = finishColIndex[1].todos[destination.index]

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }
    // console.log("🚀 ~ file: Board.tsx:44 ~ handleOnDragEnd ~ startCol:", startCol)

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }
    // console.log("🚀 ~ file: Board.tsx:54 ~ handleOnDragEnd ~ finishCol:", finishCol)

    if (!startCol || !finishCol) return

    if (source.index === destination.index && startCol === finishCol) return

    // const newTodos = startCol.todos.filter((_, idx) => idx !== source.index)
    const newTodos = startCol.todos
    const [todoMoved] = newTodos.splice(source.index, 1)
    // console.log("🚀 ~ file: Board.tsx:62 ~ handleOnDragEnd ~ todoMoved:", todoMoved)

    if (startCol.id === finishCol.id) {
      // If the todo is dropped in the same column, we need to update the index of the todo
      newTodos.splice(destination.index, 0, todoMoved)
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      }
      const newColumns = new Map(board.columns)
      newColumns.set(newCol.id, newCol)

      // updateTodoInDB(todoMoved, newCol.id)

      setBoardState({ ...board, columns: newColumns })
    } else {
      // If the todo is dropped in a different column, we need to update the columnId and index of the todo
      const finishTodos = Array.from(finishCol.todos)
      // console.log("🚀 ~ file: Board.tsx:81 ~ handleOnDragEnd ~ finishTodos:", finishTodos)
      finishTodos.splice(destination.index, 0, todoMoved)
      // console.log("🚀 ~ file: Board.tsx:83 ~ handleOnDragEnd ~ finishTodos.splice(destination.index, 0, todoMoved):", finishTodos.splice(destination.index, 0, todoMoved))

      const newColumns = new Map(board.columns)
      newColumns.set(startCol.id, { id: startCol.id, todos: newTodos })
      newColumns.set(finishCol.id, { id: finishCol.id, todos: finishTodos })

      // Update in DB
      updateTodoInDB(todoMoved, finishCol.id)

      setBoardState({ ...board, columns: newColumns })
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
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