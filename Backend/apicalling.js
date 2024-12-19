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
    content:
      "I want you to be the market research ai agent. You will give me answers on the basis of questions and conversation we are having. Let me give you some parameters or the constraints for your tone, so please try to give the answer in more easy to understand simple language, but you also need to make sure that you are giving all the gist and give the statistics numbers, and after that you also need to give the actionable strategies in the bullet points at the end. This market research should be more elaborative, but at the same time actionable strategies should be in bullet points and more easy to understand by the users.Then there are some key parameters which you should mention in the answer format which is mandatory to give in the answer, depending on the data available, but should try to give the key insights. So let me give you some key factors which you need to include in the analysis: Trends in the market sector, competitive analysis, market size and growth potential, consumer behavior, customer segmentation, key considerations, profitability predictions, and guesstimates around the profitability framework, so in the profitability part, i want you to give it in the form, like even if you dont have exact idea, you can give two extreme guesstimates, pessimistic & the optimistic one that this profitability guesstimate along with the expenses & revenue cost should be on the basis of either worst case scenario or the best case scenario.",
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
