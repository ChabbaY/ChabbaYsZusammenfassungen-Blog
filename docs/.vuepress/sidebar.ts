import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "Home",
      icon: "home",
      prefix: "/",
      link: "/",
    },
    {
      text: "Zusammenfassungen",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
  ],
});
