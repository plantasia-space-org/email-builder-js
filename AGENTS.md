# email-builder-js — Agent Rules

This repo lives inside the `ps-be` multi-repo workspace. Read the workspace guard at
`ps-be/AGENTS.md` first when starting from the workspace root.

<!-- ps-local-workflow:start (managed by .ps-preview/install-agent-nudges.sh — do not edit inside) -->
## Local workflow — work in a worktree slot, not the primary checkout

This repo uses the **ps-local-workflow**. Before editing files:

- Do NOT do feature work in the primary checkout on trunk (`dev`/`main`) — it is blocked at commit time by a git hook.
- If you are not already inside a `…/<repo>.worktrees/wt-N` directory, claim a slot first:
  `bash ~/Documents/Github/ps-all/.ps-preview/wt-new.sh <repo-path-under-ps-all> <slot 1-4> [label]`
  then `cd` into that worktree and work there. Commit on the `wt/N` branch, then merge to trunk.
- Full skill: `~/Documents/Github/ps-all/skills-in-use/ps-local-workflow/SKILL.md`
<!-- ps-local-workflow:end -->
