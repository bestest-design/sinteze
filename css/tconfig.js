document.querySelector("#stylesheet").href += Math.random()
  .toString(36)
  .substring(2, 8);

tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: "#111111",
      },
    },
  },
};
