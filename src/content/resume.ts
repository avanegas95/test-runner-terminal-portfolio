import type { Resume } from "./types";

export const resume: Resume = {
  profile: {
    name: "Anderson Vanegas",
    location: "Framingham / Boston, MA",
    title: "Staff SQA Engineer",
    company: "Boston Dynamics",
    summary:
      "QA engineer turned automation builder — pytest, Appium, CI/CD and hardware-in-the-loop testing for robotics software. Bilingual English / Spanish.",
    // TODO(confirm): Nov 2019 → now is closer to 7 years; defaulting to 6+ per plan
    yearsExperience: "6+ years",
    languages: ["English", "Spanish"],
  },

  experience: [
    {
      id: "boston_dynamics",
      company: "Boston Dynamics",
      roles: [
        {
          id: "staff_sqa_engineer",
          title: "Staff SQA Engineer",
          startDate: "Mar 2026",
          endDate: "Present",
          oneLiner:
            "Leads QA for Boston Dynamics robot software — tiered test libraries, Appium growth, and nightly HIL triage.",
          terminalPath: "experience/boston_dynamics/staff_sqa_engineer.md",
          bullets: [
            {
              text: "Reorganized a 700+ case library into Smoke / Sanity / Regression tiers, targeting a 3-month → 1-month regression cycle.",
              glossaryTerms: ["smoke", "sanity", "regression"],
            },
            {
              text: "Grew Appium UI automation from 16 → 33 tests for the robot control Android app.",
              glossaryTerms: ["appium"],
            },
            {
              text: "Owns nightly HIL triage — root-cause summaries, hotfixes, and escalation when builds block release.",
              glossaryTerms: ["hil"],
            },
            {
              text: "Authored Confluence best-practice docs and TestRail onboarding for new QA contributors.",
            },
            {
              text: "Reviews automation and test-design pull requests across the QA team.",
            },
          ],
        },
        {
          id: "senior_sqa_engineer",
          title: "Senior SQA Engineer",
          startDate: "Sep 2023",
          endDate: "Mar 2026",
          oneLiner:
            "Built Python SSH monitoring as a pytest fixture, integrated CI/CD reporting, and led QA for a product refresh.",
          terminalPath: "experience/boston_dynamics/senior_sqa_engineer.md",
          bullets: [
            {
              text: "Built a Python robot-metrics monitor over SSH — standalone tool or reusable pytest fixture with live plots and CSV export.",
              glossaryTerms: ["fixture"],
            },
            {
              text: "Automated the Android robot-control app with Appium on emulated tablets, including parametrized language tests merged into nightly HIL.",
              glossaryTerms: ["appium", "hil"],
            },
            {
              text: "Integrated automated tests into CI/CD with stage-based reporting and failure notifications.",
              glossaryTerms: ["cicd"],
            },
            {
              text: "Created and maintained Gazebo simulation worlds for pre-robot validation.",
              glossaryTerms: ["gazebo"],
            },
            {
              text: "Designed a QA training plan for non-SQA engineers and ran onboarding sessions.",
            },
            {
              text: "Served as QA point of contact and lead for a product refresh, with weekly leadership reporting.",
            },
          ],
        },
      ],
    },
    {
      id: "sharkninja",
      company: "SharkNinja",
      roles: [
        {
          id: "sqa_engineer_ii",
          title: "SQA Engineer II",
          // TODO(confirm): resume listed "Present" for both SharkNinja roles; default end Sep 2023
          startDate: "Apr 2022",
          endDate: "Sep 2023",
          oneLiner:
            "Senior individual contributor for cloud services and consumer mobile apps — automation, mentoring, and release coordination.",
          terminalPath: "experience/sharkninja/sqa_engineer_ii.md",
          bullets: [
            {
              text: "Expanded automated test coverage for cloud APIs and connected consumer mobile apps.",
            },
            {
              text: "Mentored junior SQA engineers on test design, defect reporting, and automation patterns.",
            },
            {
              text: "Led defect triage and release-readiness reviews with cross-functional partners.",
            },
            {
              text: "Coordinated standups and test-plan updates across sprint cycles.",
            },
          ],
        },
        {
          id: "sqa_engineer",
          title: "SQA Engineer",
          // TODO(confirm): default Nov 2019 – Apr 2022 per plan
          startDate: "Nov 2019",
          endDate: "Apr 2022",
          oneLiner:
            "Manual and automated QA for SharkNinja cloud services and consumer mobile apps.",
          terminalPath: "experience/sharkninja/sqa_engineer.md",
          bullets: [
            {
              text: "Manual and exploratory testing for cloud services and consumer mobile apps before customer release.",
            },
            {
              text: "Built and maintained Selenium and Appium test suites for regression coverage.",
              glossaryTerms: ["appium"],
            },
            {
              text: "Filed, tracked, and verified defects in Jira with traceability to test cases.",
            },
            {
              text: "Participated in standups, defect triage, and release coordination.",
            },
          ],
        },
        {
          id: "product_dev_intern",
          title: "Product Development Intern",
          // TODO(confirm): Apr – Nov 2019 per plan
          startDate: "Apr 2019",
          endDate: "Nov 2019",
          oneLiner:
            "Supported product development QA — test execution, documentation, and early automation experiments.",
          terminalPath: "experience/sharkninja/product_dev_intern.md",
          bullets: [
            {
              text: "Executed manual test cases for pre-release consumer products.",
            },
            {
              text: "Documented defects and assisted with regression test planning.",
            },
            {
              text: "Explored early automation tooling under senior engineer mentorship.",
            },
          ],
        },
      ],
    },
  ],

  projects: [
    {
      id: "state_of_ecosystems",
      name: "State of Ecosystems 2026",
      summary:
        "Annual ecosystem trends report for HubSpot — React + Vite 6, Figma MCP workflow, and a JSON content layer with WCAG 2.1 AA compliance.",
      stack: [
        "React",
        "Vite 6",
        "Figma MCP",
        "JSON content layer",
        "WCAG 2.1 AA",
      ],
      highlights: [
        "17 hash-driven filter variants for interactive data exploration.",
        "~50 KB JS budget enforced for fast load on marketing pages.",
        "Handed off production-ready codebase to HubSpot engineering.",
      ],
      terminalPath: "projects/state_of_ecosystems.md",
    },
    {
      id: "finance_forecast",
      name: "Finance Forecast",
      summary:
        "Full-stack SaaS forecasting tool for Datalily — React frontend, FastAPI backend, Supabase data layer, and AI-assisted PR review gates.",
      stack: [
        "React 18",
        "Vite",
        "Tailwind",
        "Vercel",
        "FastAPI",
        "Pydantic",
        "Render",
        "Supabase",
      ],
      highlights: [
        "PandaDoc sync for contract and revenue data ingestion.",
        "AI chat assistant for finance scenario exploration.",
        "Automated PR checks with Gemini Code Assist + CodeRabbit and a deploy-status gate.",
      ],
      terminalPath: "projects/finance_forecast.md",
    },
  ],

  skills: [
    {
      id: "testing_automation",
      label: "Testing & Automation",
      items: ["pytest", "Appium", "Selenium", "X-Ray", "TestRail"],
    },
    {
      id: "languages",
      label: "Languages",
      items: [
        "Python",
        "TypeScript",
        "C",
        "C++",
        "C#",
        "ASP.NET",
        "HTML",
        "CSS",
      ],
    },
    {
      id: "dev_tools",
      label: "Dev Tools",
      items: ["Git", "VS Code", "Cursor", "Android emulation"],
    },
    {
      id: "ai_assisted",
      label: "AI-Assisted Development",
      items: [
        "Claude Code",
        "Copilot",
        "Gemini Code Assist",
        "CodeRabbit",
        "MCP",
      ],
    },
    {
      id: "os",
      label: "OS",
      items: ["Linux", "Ubuntu", "macOS", "Windows", "Android", "iOS"],
    },
    {
      id: "programs",
      label: "Programs",
      items: ["Jira", "Confluence"],
    },
    {
      id: "spoken",
      label: "Spoken Languages",
      items: ["English", "Spanish"],
    },
  ],

  education: {
    institution: "Boston University",
    degree: "BS Computer Engineering",
    year: 2017,
    terminalPath: "education/boston_university.md",
  },

  contact: {
    email: "avanegas95@gmail.com",
    linkedIn: "https://www.linkedin.com/in/andersonvanegas/",
    github: "https://github.com/avanegas95",
    githubHandle: "avanegas95",
  },
};

/** Flat list of every role for lookup by id or terminal path segment */
export const allRoles = resume.experience.flatMap((co) =>
  co.roles.map((role) => ({ ...role, company: co.company, companyId: co.id })),
);

export function getRoleById(roleId: string) {
  return allRoles.find((r) => r.id === roleId);
}

export function getProjectById(projectId: string) {
  return resume.projects.find((p) => p.id === projectId);
}
