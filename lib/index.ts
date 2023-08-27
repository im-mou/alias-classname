"use strict";

type AliasesStore = Record<string, string>;
type ClassesStore = Record<string, string>;

const aliasReferenceRegex = /\(\w*\)/g;
const delimiterRegex = /:/g;

const trim = (input: string) => input.trim();
const erode = (input: string, q = 1) => input.substring(q, input.length - q);
const arrayToDict = (array: string[]) =>
  array.reduce((acc, v) => ({ ...acc, [v]: v }), {});

const validateInputs = (inputs: unknown[]): string[] => [
  // remove duplicates using Set
  ...new Set(
    inputs.filter(
      (input) => typeof input === "string" && input.trim().length > 0
    ) as string[]
  ),
];

const resolveAliases =
  (aliasesStore: AliasesStore) => (target: Record<string, string>) => {
    for (const key in target) {
      if (!Object.prototype.hasOwnProperty.call(target, key)) continue;

      const tokens = target[key].match(aliasReferenceRegex);
      if (!tokens || !tokens.length) continue;

      for (const aliasWithParentheses of tokens) {
        const deParenthesisedAlias = erode(aliasWithParentheses);
        if (!aliasesStore[deParenthesisedAlias]) continue; // should this throw an error?
        target[key] = target[key].replace(
          aliasWithParentheses,
          aliasesStore[deParenthesisedAlias]
        );
      }
    }
  };

const getAliasClassPair = (input: string) => {
  const delimiter = input.match(delimiterRegex);
  // "a:b:c" is a no-no.
  if (!delimiter || delimiter.length > 1) return null;

  const [alias, className] = input.split(":").map(trim);
  if (!alias.length || !className.length) return null;
  // do not allow self referencing aliases. ex.: "a:(a)"
  if (className.includes(`(${alias})`)) return null;
  // do not allow an alias wrapped in parentheses. ex.: "(a):b"
  if (alias.startsWith("(") && alias.endsWith(")")) return null;

  return { [alias]: className };
};

const registerAliases =
  (
    resolveAliasesFor: (store: Record<string, string>) => void,
    aliasesStore: AliasesStore
  ) =>
  (inputs: string[]) => {
    const validatedInput = validateInputs(inputs);
    for (const input of validatedInput) {
      const aliasClassPair = getAliasClassPair(input);
      if (!aliasClassPair) continue;
      Object.assign(aliasesStore, aliasClassPair);
    }
    resolveAliasesFor(aliasesStore);
  };

const aliasClassName = (...aliases: string[]) => {
  const aliasesStore: AliasesStore = {};
  const classesStore: ClassesStore = {};
  const resolveAliasesFor = resolveAliases(aliasesStore);
  const register = registerAliases(resolveAliasesFor, aliasesStore);

  if (aliases.length) register(aliases);

  const resolveClasses = (...classnames: unknown[]) => {
    const validatedClassnames = validateInputs(classnames);
    Object.assign(classesStore, arrayToDict(validatedClassnames));

    register(validatedClassnames);
    resolveAliasesFor(classesStore);

    return validatedClassnames
      .map(
        (classname) =>
          classesStore[classname].split(delimiterRegex).reverse()[0]
      )
      .join(" ");
  };

  Object.defineProperty(resolveClasses, "debug", {
    value: () => ({ aliases: aliasesStore, classes: classesStore }),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return resolveClasses;
};

export default aliasClassName;
