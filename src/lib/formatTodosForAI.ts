const formatTodosForAI = (board: Board) => {
  const todos = Array.from(board.columns.entries())

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos
    return map
  }, {} as { [key in TypedColumn]: Todo[] })
  console.log("🚀 ~ file: formatTodosForAI.ts:8 ~ flatArray ~ flatArray:", flatArray)

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length
      return map
    },
    {} as { [key in TypedColumn]: number })
  console.log("🚀 ~ file: formatTodosForAI.ts:16 ~ formatTodosForAI ~ flatArrayCounted:", flatArrayCounted)

  return flatArrayCounted
}

export default formatTodosForAI