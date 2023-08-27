<br />
<br />
<div align="center">
<img width="300" alt="alias-classname" src="https://raw.githubusercontent.com/im-mou/alias-classname/master/logo.png" />
</div>
<br />
<br />

---

# alias-classname

This utility module provides a flexible way to define aliases for CSS classes and resolve those aliases in order to generate a final classes string.

## How It Works

The `aliasClassName` function returned by this module serves as the main interface. It allows you to define aliases and resolve classes using the registered aliases. This utility handles the process of alias resolution and concatenation of classes.

## Installation

To install simply run:

Yarn:

```bash
yarn add alias-classname
```

NPM:

```bash
npm install alias-classname
```

## Usage

1. Import the `aliasClassName` function from the module:

   ```javascript
   import aliasClassName from "alias-classname";
   ```

2. Define your aliases and resolve class names:

   Basic usage:

   ```javascript
   const classes = aliasClassName();

   const classname = classes("css", "base:my-class", "(base)__modifier");
   // outputs: "css my-class my-class__modifier"
   ```

   With default aliases:

   ```javascript
   const classes = aliasClassName("base:component", "mod:container");

   const classname = classes("(base)", "body:(base)__(mod)");
   // outputs: "component component__container"

   const classname2 = classes("(body)--variant");
   // outputs: "component__container--variant"
   ```

   Default aliases can also be composed:

   ```javascript
   const classes = aliasClassName(
     "base:component",
     "mod:(base)__container",
     "var:(mod)--variant"
   );

   const classname = classes("(base)", "(mod)", "(var)");
   // outputs: "component component__container component__container--variant"
   ```

   > You're not required to use the [BEM naming convention](https://getbem.com/naming/). But if you do, it can be really helpful for that use case.

3. Debugging:

   You can access the aliases and classes stores for debugging purposes:

   ```javascript
   const debugInfo = classes.debug();
   console.log(debugInfo.aliases);
   console.log(debugInfo.classes);
   ```

## Problem

When working on projects with complex CSS class naming conventions, managing them can become really cumbersome. Especially when you need to apply multiple classes to elements, the resulting code can quickly become hard to read and maintain.

## Solution

The `aliasClassName` simplifies CSS classes management by allowing you to define aliases for longer class names. These aliases can then be easily used to generate the final joined class names string. This is particularly useful when you want to:

- Maintain cleaner and more readable code by abstracting complex class names behind meaningful aliases.
- Apply consistent and uniform class names throughout your project without repeating lengthy strings.
- Dynamically switch or toggle between different class configurations by using aliases as references.

## Functions and Methods

- `aliasClassName(...aliases: string[]): (classnames: unknown[]) => string`

  This is the main function returned by the module. It takes aliases as arguments and returns a function to resolve class names.

  - `(...classnames: unknown[]): string`

    This is the returned function that takes an array of strings, including aliases, as arguments and returns the resolved final class name string. It concatenates the class names based on the registered aliases.

  - `debug(): { aliases: AliasesStore, classes: ClassesStore }`

    This method is a property attached to the returned function that allows you to retrieve the current state of the aliases and classes stores for debugging purposes.

## Terminology

- **Aliases:** Shorter identifiers that can be used in place of longer class names.

- **Class Names:** CSS class names or any string that you want to resolve and concatenate.

## Limitations and Considerations

- Aliases should be provided as strings in the format:
  - `"alias:class-name"`.
- An alias reference should be provided in the format:
    - `"(alias)__class-name"`.
- An alias must have been registered before it's referenced.
- A redefinition of an existing alias will override its current value.
- Circular references or an alias that doesn't exist are not resolved.
  - `"a:(a)"` will output `"(a)"`.

## Contributing

All contributions are very welcome. You can submit any ideas as [pull requests](https://github.com/im-mou/alias-classname/pulls) or as [GitHub issues](https://github.com/im-mou/alias-classname/issues). If you'd like to improve code, please feel free!
