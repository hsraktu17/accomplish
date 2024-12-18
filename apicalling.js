import OpenAI from "openai";

import { config } from "dotenv";
config();

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

export async function apicall(input) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const system = {
    role: "system",
    content: "you are ai agent for market research",
  };
  const userMessage = {
    role: "user",
    content: input,
  };
  const response = await client.chat.completions.create({
    messages: [system, userMessage],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: modelName,
  });

  return response.choices[0].message.content;
}
