import { simpleFunc } from "../../../components/profile/profileInfo";

describe("A simple module", () => {
  test("it should say hello", () => {
    expect(simpleFunc()).toEqual("hello!");
  });
});