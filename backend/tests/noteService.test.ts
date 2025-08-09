// tests/noteService.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  __setOpenAIForTests,
  generateCustomNotes,
  type CustomNotes,
} from "../src/services/noteService.js";

// Minimal mock OpenAI that returns a valid JSON payload as .content
function makeMockOpenAI(payload: CustomNotes) {
  return {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: JSON.stringify(payload) } }],
        }),
      },
    },
  } as any;
}

test("generateCustomNotes returns parsed structured JSON", async () => {
  const fake: CustomNotes = {
    summary: "This is a concise academic summary of the material.",
    keyConcepts: ["Concept A", "Concept B", "Concept C"],
    visualSuggestions: ["Flowchart of A→B", "Diagram of C"],
    notableInsights: ["Insight 1", "Insight 2", "Insight 3"],
  };

  __setOpenAIForTests(() => makeMockOpenAI(fake));

  const out = await generateCustomNotes("Some parsed PDF text that is long enough.");
  assert.equal(typeof out.summary, "string");
  assert.ok(Array.isArray(out.keyConcepts) && out.keyConcepts.length >= 1);
  assert.ok(Array.isArray(out.visualSuggestions) && out.visualSuggestions.length >= 1);
  assert.ok(Array.isArray(out.notableInsights) && out.notableInsights.length >= 1);
  assert.equal(out.summary, fake.summary);
});

test("throws if model returns non-JSON text", async () => {
  const badClient = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: "NOT JSON" } }],
        }),
      },
    },
  } as any;

  __setOpenAIForTests(() => badClient);

  await assert.rejects(
    () => generateCustomNotes("Some content"),
    /valid JSON object|valid JSON/i
  );
});
