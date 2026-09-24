export const identity = {
  location: "// Boston, MA",
  name: "Anderson Vanegas",
  role: "Staff SQA Engineer at",
  company: "Boston Dynamics",
  summary:
    "6+ years in QA, now building the automation behind it: Python tooling, Appium mobile tests and CI/CD pipelines.",
  hintDesktop:
    "Every test on the right opens into part of the story. Not into terminals? The buttons above go to plain pages.",
  hintMobile:
    "Tap any test to open it — or use the buttons at the top for plain pages.",
  nav: [
    { label: "Projects", href: "/projects", primary: false },
    { label: "Resume", href: "/resume", primary: true },
    { label: "Contact", href: "/contact", primary: false },
  ],
} as const;
