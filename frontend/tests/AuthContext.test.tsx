import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import React, { useEffect } from "react";
import TestRenderer from "react-test-renderer";
import { AuthProvider, useAuth } from "../src/context/AuthContext.js";

/** helper func */
function Text({ children }: { children: string }) { return React.createElement("span", null, children); }

/** The child reads the hook and triggers logout when asked */
function Child({ callLogout }: { callLogout?: boolean }) {
  const { user, loading, logout } = useAuth();
  useEffect(() => { if (callLogout) void logout(); }, [callLogout, logout]);
  const label = loading ? "loading" : (user ? `uid:${(user as any).uid}` : "no-user");
  return <Text>{label}</Text>;
}

let unsubCalled: number;
let signOutCalled: number;

beforeEach(() => {
  unsubCalled = 0;
  signOutCalled = 0;
});

/** Mocked Firebase API for testing purposes */
function makeTestApi(userObj: any) {
  return {
    auth: { app: "test" } as any,
    onAuthStateChanged: (_auth: unknown, cb: (u: any) => void) => {
      // called immediately just like Firebase does once it resolves state
      cb(userObj);
      return () => { unsubCalled++; };
    },
    signOut: async (_auth: unknown) => { signOutCalled++; }
  };
}

test("useAuth throws outside provider", () => {
  assert.throws(() => {
    // calling hook indirectly by rendering the Child without provider
    TestRenderer.create(React.createElement(Child, {}));
  }, /useAuth must be used within an AuthProvider/);
});

test("AuthProvider renders children only after loading resolves (no user)", () => {
  const api = makeTestApi(null);

  const tree = TestRenderer.create(
    <AuthProvider authApi={api as any}>
      <Child />
    </AuthProvider>
  );

  const text = tree.root.findByType("span").children.join("");
  assert.equal(text, "no-user");
  assert.equal(unsubCalled, 0, "unsubscribe not called during mount");
});

test("AuthProvider provides user and supports logout()", async () => {
  const api = makeTestApi({ uid: "U123" });

  const tree = TestRenderer.create(
    <AuthProvider authApi={api as any}>
      <Child callLogout />
    </AuthProvider>
  );

  const text = tree.root.findByType("span").children.join("");
  assert.equal(text, "uid:U123");
  // allow effect to fire
  await new Promise(r => setTimeout(r, 0));
  assert.equal(signOutCalled, 1, "logout should call signOut exactly once");
});
