#!/bin/sh

set -eu

get_git_dir() {
  root=${1:?root is required}
  git_dir=$(git -C "$root" rev-parse --git-dir)

  case "$git_dir" in
    /*) printf '%s\n' "$git_dir" ;;
    *) printf '%s/%s\n' "$root" "$git_dir" ;;
  esac
}

write_pre_commit_hook() {
  hooks_dir=${1:?hooks directory is required}
  cat > "$hooks_dir/pre-commit" <<'HOOK'
#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

pnpm run lint:shell
pnpm run lint:ci
pnpm run build
exec pnpm run test:ci
HOOK
}

write_commit_msg_hook() {
  hooks_dir=${1:?hooks directory is required}
  cat > "$hooks_dir/commit-msg" <<'HOOK'
#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

exec pnpm exec commitlint --edit "$1"
HOOK
}

write_post_merge_hook() {
  hooks_dir=${1:?hooks directory is required}
  cat > "$hooks_dir/post-merge" <<'HOOK'
#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

exec sh scripts/setup.sh
HOOK
}

install_hooks() {
  repo_root=${1:?repository root is required}
  hooks_dir=${2:?hooks directory is required}
  mkdir -p "$hooks_dir"
  write_pre_commit_hook "$hooks_dir"
  write_commit_msg_hook "$hooks_dir"
  write_post_merge_hook "$hooks_dir"
  chmod +x "$hooks_dir/pre-commit" "$hooks_dir/commit-msg" "$hooks_dir/post-merge"
}

lint_shell() {
  repo_root=${1:?repository root is required}
  hooks_dir=${2:?hooks directory is required}
  shellcheck -x -S warning "$repo_root/scripts/setup.sh" \
    "$hooks_dir/pre-commit" "$hooks_dir/commit-msg" "$hooks_dir/post-merge"
  shellcheck-legibility check "$repo_root/scripts"
}

run_setup() {
  repo_root=${1:?repository root is required}
  cd "$repo_root"
  CI=true pnpm install
  pnpm run lint:shell
  pnpm run build
  pnpm run test
}

main() {
  repo_root=$(git rev-parse --show-toplevel)
  git_dir=$(get_git_dir "$repo_root")
  hooks_dir="$git_dir/hooks"
  install_hooks "$repo_root" "$hooks_dir"
  lint_shell "$repo_root" "$hooks_dir"

  case "${1:-}" in
    --hooks-only)
      echo "Git hooks are up to date."
      return 0
      ;;
  esac

  run_setup "$repo_root"
  echo "Setup complete."
}

main "$@"
