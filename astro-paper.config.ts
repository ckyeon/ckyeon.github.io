import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.ckyeon.com/",
    title: "Kiyeon Cho",
    description: "A developer’s journey in code.",
    author: "Kiyeon Cho",
    profile: "https://github.com/ckyeon",
    ogImage: "default-og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github",   url: "https://github.com/ckyeon" },
    { name: "linkedin", url: "https://www.linkedin.com/in/ckyeon/" },
    { name: "mail",     url: "mailto:qsky8520@gmail.com" },
  ],
  shareLinks: [
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});