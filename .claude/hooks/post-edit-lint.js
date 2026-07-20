// Post-edit hook: runs ESLint on any TypeScript/TSX file after Claude edits it.
// Reads the edited file path from stdin (JSON tool_input.file_path) and runs
// "npm run lint -- --fix" in the front-end/ directory if the file is under src/.
// Returns a warning message if lint errors remain so Claude can fix them.

const raw = require("fs").readFileSync("/dev/stdin", "utf8");
const data = JSON.parse(raw);
const filePath = data?.tool_input?.file_path ?? "";

if (!/\.(ts|tsx)$/.test(filePath) || !filePath.includes("front-end")) {
  process.exit(0);
}

const { execSync } = require("child_process");
try {
  execSync(`npm run lint -- --fix --quiet`, {
    cwd: require("path").resolve(__dirname, "../../front-end"),
    stdio: "inherit",
  });
} catch {
  console.error("ESLint found errors that could not be auto-fixed. Review the output above.");
  process.exit(1);
}
