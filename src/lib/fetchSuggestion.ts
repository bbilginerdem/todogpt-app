import formatTodosForAI from "./formatTodosForAI"

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board)
  console.log("todos are:", todos)

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  })

  console.log(res)

  const GPTdata = await res.json()
  const { content } = GPTdata

  return content
}

export default fetchSuggestion