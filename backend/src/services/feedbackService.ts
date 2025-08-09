import { OpenAI } from "openai";

/** Factory for testing purposes: can inject a mock OpenAI without needing an API key */
let _openAIFactory: () => OpenAI = () =>
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Testing-only hook to inject mock OpenAI client */
export const __setOpenAIForTests = (factory: () => OpenAI) => {
  _openAIFactory = factory;
};

export const generateEmotionFeedback = async (
  emotion: string,
  reason?: string
): Promise<string> => {
  const prompt = `
You are a supportive AI study companion.

The student just finished a study session and reported the following:

- Emotion: "${emotion}"
- Reason: "${reason || "No reason provided"}"

Respond with a short (1-2 sentence) personalized message of encouragement, empathy, or advice based on their emotional state.

Be kind, understanding, supportive, and slightly playful if appropriate. Do NOT include headers or emojis. Just the message.
`.trim();

  const openai = _openAIFactory();

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  });

  const message = res.choices?.[0]?.message?.content?.trim();
  if (!message) throw new Error("No response generated from OpenAI");

  return message;
};
