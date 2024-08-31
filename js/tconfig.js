// Tailwind configuration

tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: "#111111",
      },
      fontFamily: {
        mono: ["ui-monospace", '"Kode Mono"'],
      },
    },
  },
  plugins: [
    function ({ addVariant, e, postcss }) {
      addVariant("firefox", ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: "-moz-document",
          params: "url-prefix()",
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    },
  ],
};
