import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import TestRenderer from "react-test-renderer";

// minimal mocked auth hook we can adjust per test 
let authState = { user: null as any, loading: false };
function useAuth() {
  return authState;
}

const NavigateTag: React.ElementType = (props: any) =>
  React.createElement("navigate", props);
const OutletTag: React.ElementType = (props: any) =>
  React.createElement("outlet", props);
const SpinnerTag: React.ElementType = (props: any) =>
  React.createElement("spinner", props);
const BoxTag: React.ElementType = (props: any) =>
  React.createElement("box", props);

const ProtectedRoute = (() => {
  return function ProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) {
      return React.createElement(BoxTag, null, React.createElement(SpinnerTag));
    }
    return user
      ? React.createElement(OutletTag)
      : React.createElement(NavigateTag, { to: "/signin", replace: true });
  };
})();

test("shows spinner while loading", () => {
  authState = { user: null, loading: true };
  const tree = TestRenderer.create(React.createElement(ProtectedRoute));
  assert.equal(tree.root.findAllByType(SpinnerTag).length, 1);
});

test("navigates to /signin when no user", () => {
  authState = { user: null, loading: false };
  const tree = TestRenderer.create(React.createElement(ProtectedRoute));
  const nav = tree.root.findByType(NavigateTag);
  assert.equal(nav.props.to, "/signin");
  assert.equal(nav.props.replace, true);
});

test("renders Outlet when user exists", () => {
  authState = { user: { uid: "U1" }, loading: false };
  const tree = TestRenderer.create(React.createElement(ProtectedRoute));
  assert.equal(tree.root.findAllByType(OutletTag).length, 1);
});
