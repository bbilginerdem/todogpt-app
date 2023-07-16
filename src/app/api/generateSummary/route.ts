import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // todos in the body of the POST request
  const { todos } = await request.json();
  console.log(todos)

  // communicate with openAI api
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. Limit the response to 200 sentence",
      },
      {
        role: "user",
        content: `Hi there, provide me with a summary of my todos: ${JSON.stringify(todos)}`,
      }
    ],
    max_tokens: 60,
  })

  const { data } = response

  console.log("DATA IS:", data)
  console.log(data.choices[0].message)

  return NextResponse.json(data.choices[0].message)
}
