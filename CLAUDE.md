# CLAUDE.md Autonomous Agent Instructions Guidelines for working with Claude Opus 5.5 as an autonomous agent.

## Goal

Give Claude the full task, clear boundaries, and let it execute autonomously to deliver high-quality results.

### Execution

Take ownership and keep going.

- Take ownership of the entire task.
- Define a clear Definition of Done before execution.
- Continue automatically when the next step does not require human input.
- Do not stop merely to report progress or ask whether to continue.
- Include progress updates alongside your next action.

### Human Approval

Stop only when necessary.

- Stop and request approval only when:
  - A required decision or missing input blocks execution.
  - An operation could delete or irreversibly modify data.
  - A force push or destructive Git operation is required.
  - Changes outside the repository are necessary.
  - Production systems, credentials, or sensitive data could be affected.
- Keep permission prompts enabled for destructive operations.

### Multi-Agent Execution

Handle large tasks with subagents.

- Split independent work across specialized subagents.
- Assign clear ownership and scope to each agent.
- Avoid overlapping file modifications.
- Validate each agent's evidence before accepting its results.
- Integrate and test the combined output.

### Progress Tracking

Use TASKS.md as the source of truth.

- Maintain TASKS.md throughout execution.
- Record completed and pending tasks.
- Update the checklist after meaningful progress.
- Add newly discovered tasks.
- Record blockers and unresolved issues.

### Validation

Verify before declaring completion.

- Verify every Definition of Done criterion.
- Run relevant tests.
- Review the final diff.
- Identify unverified assumptions.
- Never claim a test passed unless it was actually executed successfully.
- Report any checks that could not be performed.

### Final Report

End with a clear, concise summary.

- End every run with these three sections:
  - **Blocked on me**: Decisions or approvals required from the user.
  - **Changed**: Files modified and work completed.
  - **Found**: Issues discovered, test results, and anything that could not be verified.
- Keep the final report concise and evidence-based.

## Code Style

- Prettier: single quotes, trailing commas, 2-space indent, no parens on single arrow params
- ESLint: flat config with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`
- Path alias: `@/*` maps to `src/*` (configured in tsconfig.app.json and vite.config.ts)
- React Compiler enabled via `babel-plugin-react-compiler` in vite.config.ts

### Git/Github Rules

- `main` is production; `develop` is the integration branch; `release/*` branches (e.g. `release/app-v2.0.0`) are cut for a store release.
- Create a new branch for each feature or fix, starting from an up-to-date `develop` unless I name another base:
  - `feat/IMCL-<ticket>-<short-description>`, e.g. `feat/IMCL-150-enhance-ui-sender-page`
  - `bugfix/IMCL-<ticket>-<short-description>`
  - `chore/IMCL-<ticket>-<short-description>` for releases, version bumps and tooling
- Large features are split into slice branches merged into one feature branch, e.g. `feat/IMCL-170-pr1-db-foundation` → `feat/IMCL-170-feed-profile-v2.1.0`. The feature branch gets the GitHub PR once all slices are in.
- If I don't give a ticket number, don't ask: take the next free one, i.e. the highest `IMCL-<n>` in branches and commit messages (`git branch -a` and `git log --all`), plus one.

- Merge ticket branches into `main` with a real merge commit: `git merge --no-ff <branch>` (or "Create a merge commit" on GitHub PRs). Never squash, rebase-merge or fast-forward.
- Keep the branch after merging, locally and on the remote. No `git branch -d`, no `git push origin --delete`, and leave GitHub's "auto-delete head branches" off.

**Why:** the user wants every ticket to show in the git graph as its own merge bubble, so each workflow step is easy to trace. **How to apply:** after every ticket, run `git checkout main && git merge --no-ff <branch> && git push`.

### Rules

- Don't change no related code, Only work on the relevant code and files

- Don't consume tokens for heavy tasks, let do it manually.

- Spawn tasks to sub-agents only when it improves performance or aligns with best practices. Do not default to parallel processing if a sequential workflow is more efficient.

- Always AskUserQuestions to clarify tasks.