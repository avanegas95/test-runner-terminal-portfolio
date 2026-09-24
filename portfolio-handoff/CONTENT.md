# Content: all copy for the site

Source of truth for text. Anything marked **[TBD]** needs Anderson's input.

## Identity (sidebar / hero)
- Location comment: `// Boston, MA`
- Name: **Anderson Vanegas**
- Role: Staff SQA Engineer at **Boston Dynamics**.
- Summary: 6+ years in QA, now building the automation behind it: Python tooling, Appium mobile tests and CI/CD pipelines.
- Nav: **Projects** [TBD destination] · **Resume** (primary) [TBD: PDF or page] · **Contact** [TBD: email / LinkedIn / form]
- Home hint (desktop): Every test on the right opens into part of the story. Not into terminals? The buttons above go to plain pages.
- Home hint (mobile): Tap any test to open it — or use the buttons at the top for plain pages.

## Test run (suggested data shape)
```ts
type Test = { id: string; name: string; ms: number; status: 'pass' | 'fail'; detail?: Detail };
type Suite = { file: string; tests: Test[] };
```

| Suite | Test name | ms | Status | Detail written? |
|---|---|---|---|---|
| career.spec.ts | 6+ years of QA experience | 412 | pass | [TBD] |
| career.spec.ts | Boston Dynamics — QA lead, 2023–present | 274 | pass | **yes, below** |
| career.spec.ts | SharkNinja — cloud & mobile app QA, 2019–2023 | 198 | pass | draft below |
| career.spec.ts | mentors junior engineers | 96 | pass | [TBD] |
| career.spec.ts | trains non-SQA engineers in QA | 143 | pass | [TBD] |
| automation.spec.ts | Appium mobile automation | 188 | pass | [TBD] |
| automation.spec.ts | CI/CD pipeline integration | 231 | pass | [TBD] |
| automation.spec.ts | HIL + Gazebo simulation testing | 305 | pass | [TBD] |
| automation.spec.ts | Python SSH robot-metrics monitor | 167 | pass | [TBD] |
| automation.spec.ts | stage-based test reporting | 122 | pass | [TBD] |
| tooling.spec.ts | Selenium web automation | 154 | pass | [TBD] |
| tooling.spec.ts | Jenkins + Buildkite pipelines | 88 | pass | [TBD] |
| tooling.spec.ts | Jira · Zephyr · X-Ray test management | 71 | pass | [TBD] |
| tooling.spec.ts | Linux / Bash | 64 | pass | [TBD] |
| personality.spec.ts | ability to ignore a flaky test | — | **fail** | **yes, below** |

**Summary:** Tests: 14 passed, 1 failed, 0 skipped — coverage 98% · Time: 2.51s (the sum of the pass timings; compute it from data).
Comment under the summary: `// 14 of 15 checks pass. The failing one is the fun part.`

## Detail: Boston Dynamics
- role: Staff SQA Engineer · company: Boston Dynamics · period: 2023 — present
- Plain English: Anderson leads quality for Boston Dynamics' robot software. He tests it on real robots, in simulation and in the Android app — then automates those checks so every build runs them.
- describe('what he does'):
  - QA lead across HIL, Gazebo simulation and Appium Android app testing
  - Built a Python, SSH-based monitoring tool for real-time robot metrics
  - Integrated automated tests into CI/CD with stage-based reporting
  - Onboarded non-SQA engineers through QA training
- Glossary:
  - HIL = hardware-in-the-loop: software tested against real robot hardware.
  - Gazebo = a robotics simulator, for testing without a physical robot.
- Actions: Collapse · Next: SharkNinja → · Full resume →

## Detail: SharkNinja (draft from the brief; not mocked)
- role: [TBD title] · company: SharkNinja · period: 2019 — 2023
- Plain English: [TBD — e.g. "Tested SharkNinja's cloud services and consumer mobile apps before they reached customers."]
- describe('what he did'):
  - Manual testing for cloud services and consumer mobile apps
  - Mentored junior engineers
  - Standups, defect triage and release coordination

## Failed test: flaky test
- `● personality › ability to ignore a flaky test`
- `expect(anderson.ignore(flakyTest)).toBe(true)`
- Expected: `true`
- Received: `"rerun it, reproduce it, find the root cause, file the ticket"`
- `at Object.<anonymous> (personality.spec.ts:1:1)`
- `// Status: won't fix. Working as intended.`

## KNOWN_ISSUES.md (drafts, for Anderson to review)
Title: **Known Issues** · Subtitle: The person behind the test plans, filed like a bug report.

| ID | Issue | Severity | Status |
|---|---|---|---|
| KI-01 | Can't walk past a Raspberry Pi or ESP32 without starting a project. | low | won't fix |
| KI-02 | Runs a self-hosted homelab server and takes its uptime personally. | medium | by design |
| KI-03 | Carries a Fujifilm X100VI everywhere. Expect photos. | low | by design |
| KI-04 | The 3D printer queue is never empty. | low | open |
| KI-05 | Does his own wiring and plumbing, then regression-tests the house. | medium | by design |
| KI-06 | Streams games, always in 16:9 for the viewers. | cosmetic | won't fix |
| KI-07 | Mows the lawn in straight, reproducible lines. | cosmetic | closed |
| KI-08 | Cannot resist a pun. | low | won't fix |

Footer: "Found another one?" → **Report it — Contact →**

## Tools (reference)
Python, Appium, Selenium, Jenkins, Buildkite, Jira, Zephyr, X-Ray, Linux/Bash.
