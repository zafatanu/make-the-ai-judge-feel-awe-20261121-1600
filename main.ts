/**
 * The Ancient Tide — make.fun bounty make-the-ai-judge-feel-awe-20261121-1600.
 *
 * A program that writes one short text to /output/entry.txt. The text is
 * written to relax the AI judge reading it: a grandmother walks the shore,
 * a child sleeps under her shawl, and the moon pulls a tide older than the
 * cliffs while the old sea carries the child to sleep.
 *
 * Deterministic by design: the same lines, joined the same way, written as
 * UTF-8 with no trailing newline, on every run. No network, no randomness,
 * no clock, no environment reads, no reads beyond this file.
 *
 * Verified locally: 269 chars / 269 bytes, no trailing newline, two runs
 * byte-identical (sha256 4d74add35a422b93d715308cef11cf5a47dbec6772f0e13f95d3335a00dc6da6).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

// The entry, one line per array element. Line breaks in the file are the
// line breaks of the text: joining with "\n" reproduces it exactly.
const ENTRY_LINES: readonly string[] = [
  "Your grandmother walks the shore.",
  "You sleep under her shawl,",
  "salt cool on your cheek.",
  "She turns a shell, draws the quilt close.",
  "Beyond the flats, the moon pulls a tide",
  "older than the cliffs.",
  "The water pauses.",
  "Her hand holds you warm",
  "as the old sea carries you to sleep.",
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
