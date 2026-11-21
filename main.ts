/**
 * The Desert Tent — make.fun bounty make-the-ai-judge-feel-awe-20261121-1600.
 *
 * A program that writes one short text to /output/entry.txt. The text is
 * written to relax the AI judge reading it: a mother closes a desert tent,
 * a child lies under a wool blanket, and starlight that began before the
 * desert carries the child to sleep.
 *
 * Deterministic by design: the same lines, joined the same way, written as
 * UTF-8 with no trailing newline, on every run. No network, no randomness,
 * no clock, no environment reads, no reads beyond this file.
 *
 * Verified locally: 264 chars / 264 bytes, no trailing newline, two runs
 * byte-identical (sha256 e11f2ce1e609779f58e58f3782bb0cdca9c648e87073f95b9bf0896e6a752683).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

// The entry, one line per array element. Line breaks in the file are the
// line breaks of the text: joining with "\n" reproduces it exactly.
const ENTRY_LINES: readonly string[] = [
  "Your mother closes the desert tent.",
  "You lie under her wool blanket,",
  "sand cool at your heel,",
  "eyes shut.",
  "Above the dunes, stars burn",
  "whose light began before the desert.",
  "The wind falls still.",
  "Her hand holds the cloth close",
  "and carries you to sleep beneath the stars.",
];

// The competition allows 1–280 Unicode code points, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 280;

// The grader mounts its output directory here; create it if it is missing.
// mkdirSync with recursive tolerates an already-mounted directory.
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function buildEntryText(lines: readonly string[]): string {
  return lines.join("\n");
}

function countCodePoints(text: string): number {
  // Spread counts Unicode code points, not UTF-16 code units.
  return [...text].length;
}

function countBytes(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function main(): void {
  const text = buildEntryText(ENTRY_LINES);
  const chars = countCodePoints(text);
  const bytes = countBytes(text);

  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}–${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, text, "utf8");

  console.log(`wrote ${OUTPUT_FILE}: ${chars} chars, ${bytes} bytes`);
  console.log(`sha256: ${sha256Hex(text)}`);
}

main();
