# Calendra website agent rules

Follow [AGENTS.md](AGENTS.md). Every CI job uses only local self-hosted Linux runners (`runs-on: [self-hosted, Linux]`), never GitHub-hosted compute or fallback. Preserve the security guard that blocks untrusted fork PRs from running on the personal machine. Allow jobs to queue when local runners are unavailable.
