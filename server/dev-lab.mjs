import { spawn } from "node:child_process";

const children = [
  spawn("node", ["server/signaling.mjs"], {
    stdio: "inherit",
    env: process.env,
  }),
  spawn("npx", ["vite", "--host", "0.0.0.0"], {
    stdio: "inherit",
    env: process.env,
  }),
];

const stop = (signal) => {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
};

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stop(signal);
    process.exit(0);
  });
}

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (code && code !== 0) {
      stop(signal ?? "SIGTERM");
      process.exit(code);
    }
  });
}
