"use server"

export async function GetCohereKey() {
  return process.env.COHERE_API_KEY!
}