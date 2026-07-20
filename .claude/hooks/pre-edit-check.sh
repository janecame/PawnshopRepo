#!/usr/bin/env bash
# Pre-edit hook: warns before Claude edits files that should not be changed directly.
# Currently flags: .env files and any file outside front-end/ or server/ to avoid
# accidental edits to config or generated files.

FILE=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('file_path',''))" 2>/dev/null)

if [[ "$FILE" == *".env"* ]]; then
  echo '{"continue":false,"stopReason":"Blocked: .env files must not be edited by Claude. Set environment variables manually."}'
  exit 1
fi

exit 0
