#!/bin/sh
set -eu

cleanup() {
  docker compose -f ops/compose.yml --project-directory . --profile e2e down --remove-orphans
}

trap cleanup EXIT INT TERM

docker compose -f ops/compose.yml --project-directory . --profile e2e up --build --abort-on-container-exit --exit-code-from k6 k6
