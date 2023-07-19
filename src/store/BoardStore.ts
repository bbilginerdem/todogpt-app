import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';

interface BoardState {
  board: Board
  searchString: string
  setSearchString: (searchString: string) => void
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void
  newTaskInput: string
  setNewTaskInput: (newTaskInput: string) => void
  newTaskType: TypedColumn
  setNewTaskType: (newTaskType: TypedColumn) => void
  image: File | null
  setImage: (image: File | null) => void
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  setBoardState: (board) => set({ board }),

  searchString: '',
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board })
  },


  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)

    newColumns.get(id)?.todos.splice(taskIndex, 1)

    set({ board: { columns: newColumns } })

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id
    )
  },

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    )
  },

  newTaskInput: '',
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  newTaskType: 'todo',
  setNewTaskType: (type: TypedColumn) => set({ newTaskType: type }),

  image: null,
  setImage: (image: File | null) => set({ image }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined

    if (image) {
      const fileUploaded = await uploadImage(image)
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: JSON.stringify(file) })
      }
    )

    set({ newTaskInput: "" })

    set((state) => {
      const newColumns = new Map(state.board.columns)

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: file })
      }

      const column = newColumns.get(columnId)

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns
        }
      }
    })
  }
}));