"use strict";

type AliasesStore = Record<string, string>;
type ClassesStore = Record<string, string>;
type ResolveClassesFn = {
  <R extends unknown[]>(...classnames: R): string;
  debug: () => { aliases: AliasesStore; classes: ClassesStore };
};

const aliasDelimiterRegex = /:/g;
const aliasReferenceRegex = /\(\w*\)/g;

const trim = (input: string) => input.trim();
const erode = (input: string, q = 1) => input.substring(q, input.length - q);
const arrayToDict = (array: string[]) =>
  array.reduce((acc, v) => ({ ...acc, [v]: v }), {});

const validateInputs = (inputs: unknown[]): string[] =>
  inputs.filter(
    (input, index) =>
      typeof input === "string" &&
      input.trim().length > 0 &&
      inputs.indexOf(input) === index
  ) as string[];

const resolveAliases =
  (aliasesStore: AliasesStore) => (target: Record<string, string>) => {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        const tokens = target[key].match(aliasReferenceRegex);
        if (!tokens || !tokens.length) continue;

        for (const aliasWithParentheses of tokens) {
          const deParenthesisedAlias = erode(aliasWithParentheses);
          // should this throw an error?
          if (!aliasesStore[deParenthesisedAlias]) continue;
          target[key] = target[key].replace(
            aliasWithParentheses,
            aliasesStore[deParenthesisedAlias]
          );
        }
      }
    }
  };

const getAliasClassPair = (input: string) => {
  const delimiter = input.match(aliasDelimiterRegex);
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

  const resolveClasses = <R extends unknown[]>(...classnames: R): string => {
    const validatedClassnames = validateInputs(classnames);
    Object.assign(classesStore, arrayToDict(validatedClassnames));

    register(validatedClassnames);
    resolveAliasesFor(classesStore);

    return validatedClassnames
      .map(
        (classname) =>
          classesStore[classname].split(aliasDelimiterRegex).reverse()[0]
      )
      .join(" ");
  };

  Object.defineProperty(resolveClasses, "debug", {
    value: () => ({ aliases: aliasesStore, classes: classesStore }),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return <ResolveClassesFn>resolveClasses;
};

export { aliasClassName };
export default aliasClassName;
