import { expect, it, describe } from "vitest";
import aliasClassName from "../lib";

describe("alias-classname", () => {
  it("should create an instance", () => {
    const instance = aliasClassName();
    expect(typeof instance === "function").toBeTruthy();
  });

  it("should have a debug function", () => {
    const instance = aliasClassName();
    expect(typeof instance.debug === "function").toBeTruthy();
    const { aliases, classes } = instance.debug();
    expect(typeof aliases).toBe("object");
    expect(typeof classes).toBe("object");
  });

  it("Should filter out all the invalid classes", () => {
    const instance = aliasClassName();
    const classes = instance(
      "class",
      undefined,
      "",
      "  ",
      false,
      true,
      null,
      0,
      234
    );
    expect(classes).toEqual("class");
  });

  it("Should filter out all the duplicated classes", () => {
    const instance = aliasClassName();
    const classes = instance("a", "a", "b", "b", "c", "a");
    expect(classes).toEqual("a b c");
  });

  it("should register default aliases", () => {
    const instance = aliasClassName("base:class", "mod:modifier");
    expect(instance("(base)")).toBe("class");
    expect(instance("(mod)")).toBe("modifier");
    expect(instance("(base)__(mod)")).toBe("class__modifier");
    expect(instance("(base)__(mod)", "(mod)", "q")).toBe(
      "class__modifier modifier q"
    );
    expect(instance("(random)")).toBe("(random)");
  });

  it("should validate the aliases when registering", () => {
    [
      { input: ["a:x"], output: { a: "x" } },
      {
        input: ["a:x", "b:(a)y", "c:(b)z", "q"],
        output: { a: "x", b: "xy", c: "xyz" },
      },
      { input: [":"], output: {} },
      { input: ["      :   "], output: {} },
      { input: ["a:"], output: {} },
      { input: [":b"], output: {} },
      { input: ["a:b:c"], output: {} },
      { input: ["a:(a)"], output: {} },
      { input: ["(a):(b)"], output: {} },
    ].forEach(({ input, output }) => {
      const { aliases } = aliasClassName(...input).debug();
      expect(aliases).toEqual(output);
    });
  });

  describe("without aliases", () => {
    it("should output the class passed in", () => {
      const instance = aliasClassName();
      expect(instance("a")).toBe("a");
      expect(instance("b")).toBe("b");
    });

    it("should output the classes list passed in", () => {
      const instance = aliasClassName();
      expect(instance("a", "b")).toBe("a b");
      expect(instance("a", "b", "c")).toBe("a b c");
    });
  });

  describe("with aliases", () => {
    it("should create an alias and output the passed in class", () => {
      const instance = aliasClassName("a:x", "b:y");
      expect(instance("a", "b")).toBe("a b");
    });

    it("should override alias value", () => {
      const instance = aliasClassName();
      expect(instance("a:x", "(a)")).toBe("x x");
      expect(instance("a:y", "(a)")).toBe("y y");
      expect(instance("a:z", "(a)")).toBe("z z");
    });

    it("should use an alias and output the composed class", () => {
      const instance = aliasClassName("a:x");
      const classes = instance("(a)__class");
      expect(classes).toEqual("x__class");
    });

    it("should not resolve an alias if not formed correctly", () => {
      const instance = aliasClassName();
      expect(instance("base:(base)class")).toBe("(base)class");
      expect(instance(":")).toBe("");
      expect(instance("a:")).toBe("");
      expect(instance(":b")).toBe("b");
      expect(instance(" c  :b", "(c)")).toBe("b b");
      expect(instance("a:(a)")).toBe("(a)");
      expect(instance("(a):b")).toBe("b");
      expect(instance("a:b:c")).toBe("c");
    });

    it("should create and alias of a composition of class and another alias", () => {
      const instance = aliasClassName();
      const classes = instance(
        "base:class",
        "mod:(base)__modifier",
        "mod2:(mod)--variant",
        "(mod2)--variant1"
      );

      expect(classes).toEqual(
        "class class__modifier class__modifier--variant class__modifier--variant--variant1"
      );
    });
  });
});
