import { databases } from "../appwrite"

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_COLLECTION_ID!,
  )

  const todos = data.documents

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, { id: todo.status, todos: [] })
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      // get the image if it exists, otherwise undefined
      ...(todo.image && { image: JSON.parse(todo.image) })
    })

    return acc
  }, new Map<TypedColumn, Column>())

  // if columns doesn't have inprogress, todo and done, add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"]
  for (const type of columnTypes) {
    if (!columns.get(type)) {
      columns.set(type, { id: type, todos: [] })
    }
  }

  // sort the columns by the order of columnTypes
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort((a, b) => (
      columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    ))
  )

  const board: Board = {
    columns: sortedColumns
  }

  return board
}