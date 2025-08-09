import { test } from "node:test";
import assert from "node:assert/strict";
import {
  __setOpenAIForTests,
  generateEmotionFeedback,
} from "../src/services/feedbackService.js";

// Mock OpenAI returning the given text
function fakeClientReturning(text: string) {
  return {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: text } }],
        }),
      },
    },
  } as any;
}

test("generateEmotionFeedback returns trimmed model message", async () => {
  __setOpenAIForTests(() => fakeClientReturning("  You did great—take a short break and review later.  "));
  const msg = await generateEmotionFeedback("tired", "long session");
  assert.equal(msg, "You did great—take a short break and review later.");
});

test("throws when model returns empty content", async () => {
  __setOpenAIForTests(() => fakeClientReturning("   "));
  await assert.rejects(
    () => generateEmotionFeedback("stressed"),
    /No response generated/i
  );
});
