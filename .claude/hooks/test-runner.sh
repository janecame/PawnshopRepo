#!/usr/bin/env bash
# Post-tool hook: runs Vitest in related feature folder after Claude edits a test file.
# Only triggers when the edited file matches *.test.ts or *.test.tsx.
# Exits non-zero and surfaces failures so Claude can react to broken tests.

FILE=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('file_path',''))" 2>/dev/null)

if [[ "$FILE" != *".test.ts"* && "$FILE" != *".test.tsx"* ]]; then
  exit 0
fi

cd "$(dirname "$0")/../../front-end" || exit 0
npx vitest run --reporter=verbose "$FILE"
