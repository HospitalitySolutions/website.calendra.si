# Repository working rules

## Mandatory local self-hosted CI for all agents

- Applies to Codex, ChatGPT, Claude, Copilot, humans and automated agents. **Every GitHub Actions job must use only local self-hosted Linux runners**, never GitHub-hosted runners.
- Use `runs-on: [self-hosted, Linux]` in every `.github/workflows/` job: pushes, internal PRs, manual runs, tests and builds. No `ubuntu-latest`, `windows-latest`, `macos-latest`, cloud choice or hosted fallback.
- If local runners are busy, jobs queue; if offline or unregistered for this repository, report the blocker. Do not bypass tests or reduce validation just to publish.
- A Git push can run from any approved local machine or integration. The *GitHub Actions jobs triggered by the push* must use a local self-hosted runner.
- **Security:** This is a public repository. Never run fork pull-request code on self-hosted machines; skip external-fork jobs without switching them to GitHub-hosted compute. Preserve the fork guard in the workflow.
- Verify the self-hosted runner policy script in CI. A self-hosted Linux runner must be registered or shared with this repository; a runner registered only to a different repository is not automatically available here. Install Chromium system libraries on the runner in advance as needed.

