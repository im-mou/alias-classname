const aliasDelimiterMatcher = /^.+:/;
const aliasMatcher = /\(\w*\)/g;

export const validateString = (input: unknown) =>
  typeof input === "string" && input.trim().length > 0;

const resolveAliases = (aliases: Record<string, string>) => (input: string) => {
  const aliasTokens = input.match(aliasMatcher);
  if (aliasTokens?.length) {
    return aliasTokens.reduce(
      (output, alias) => output.replace(alias, aliases[alias]),
      input
    );
  }
  return input;
};

const extractAliases = (acc: Record<string, string>, b: string) => {
  if (!aliasDelimiterMatcher.test(b)) return acc;
  const tokens = b.split(":");
  if (tokens.length > 2)
    throw Error("Found multiple alias delimiter (:) in the same input");
  if (!tokens[0].trim().length || !tokens[1].trim().length)
    throw Error("Found no alias or classname in the input");
  return {
    ...acc,
    [`(${tokens[0]})`]: resolveAliases(acc)(tokens[1]),
  };
};

const getUnAliasedClasses = (input: string) => {
  if (!aliasDelimiterMatcher.test(input)) return input;
  const tokens = input.split(":");
  if (tokens.length > 2)
    throw Error("Found multiple alias delimiter (:) in the same input");
  if (!tokens[0].trim().length || !tokens[1].trim().length)
    throw Error("Found no alias or classname in the input");
  return tokens[1];
};

export const aliasClassName = (...defaultAliases: string[]) => {
  let aliases = {};
  let classNames = new Set<string>();
  let classes = [];
  return (...inputs: unknown[]) => {
    (inputs.filter(validateString) as string[]).forEach(
      classNames.add,
      classNames
    );

    const classesArray = Array.from(classNames);

    const extractedAliaes = classesArray.reduce(extractAliases, {});
    aliases = { ...aliases, ...extractedAliaes };

    classes = classesArray
      .map(resolveAliases(aliases))
      .map(getUnAliasedClasses);

    return classes.join(" ");
  };
};
