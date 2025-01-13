import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/ChabbaYsZusammenfassungen-Blog/",

  lang: "en-US",
  title: "Zusammenfassungen",
  description: "A website and blog for summarizations",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
