import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

async function findSources(srcDir: string): Promise<Record<string, string>[]> {
  const res: Record<string, string>[] = [];
  const fullSrcDir = path.resolve(import.meta.dirname, srcDir);
  const dir = await fs.promises.opendir(fullSrcDir);
  for await (const dirent of dir) {
    if (dirent.name.endsWith('.test.js')) {
      const src = path.resolve(dirent.parentPath, dirent.name);
      res.push({ path: src, filename: dirent.name });
    }
  }
  return res;
}

async function readLines(filePath: string): Promise<string[]> {
  const fileStream = fs.createReadStream(filePath);

  const reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Recognizes all instances of CR LF (\r\n) as a single line break
  });

  const res: string[] = [];

  for await (const line of reader) {
    res.push(line);
  }
  return res;
}

function processLines(lines: string[]): string[] {
  const res: string[] = [];
  const filteredLines: string[] = [];
  for (let line of lines) {
    line = line.trimStart();
    if (!line.startsWith('//')) {
      filteredLines.push(line);
    }
  }
  for (let line of filteredLines) {
    if (!line.startsWith('import')) {
      res.push(line);
    }
  }
  return res;
}

async function generatePreprodTests(
  srcDir: string,
  fullDestDir: string,
  importLines: string[]
): Promise<void> {
  if (fs.existsSync(fullDestDir)) {
    fs.rmSync(fullDestDir, { recursive: true, force: true });
  }
  fs.mkdirSync(fullDestDir, { recursive: true });
  const srcFiles = await findSources(srcDir);
  for (let srcFile of srcFiles) {
    const allLines = await readLines(srcFile.path);
    const lines = processLines(allLines);
    const newLines = [...importLines, ...lines];

    const newFilePath = path.resolve(fullDestDir, srcFile.filename);
    const content = newLines.join('\n');
    await fs.promises.writeFile(newFilePath, content, 'utf8');
  }
}

// "import { BLACK, compare, JsIterator, JsReverseIterator, KeyOnlyPolicy, KeyValuePolicy, ReverseIterator, RED, Tree, TreeIterator, TreeMap, TreeMultiMap, TreeNode, TreeSet, TreeMultiSet, ValueOnlyPolicy } from '../../dist/umd/jstreemap.js';",
async function main(): Promise<void> {
  const srcDir = process.argv[2];
  const destDir = process.argv[3];
  const fullDestDir = path.resolve(import.meta.dirname, destDir);
  await generatePreprodTests(srcDir, path.resolve(fullDestDir, 'umd-tests'), [
    "import { describe, it } from 'vitest';",
    "import should from 'should';",
    "import { compare, JsIterator, JsReverseIterator, KeyOnlyPolicy, KeyValuePolicy, NodeColors, ReverseIterator, Tree, TreeIterator, TreeMap, TreeMultiMap, TreeNode, TreeSet, TreeMultiSet, ValueOnlyPolicy } from '../../../dist/umd/jstreemap.cjs';",
  ]);
  await generatePreprodTests(srcDir, path.resolve(fullDestDir, 'esm-tests'), [
    "import { describe, it } from 'vitest';",
    "import should from 'should';",
    "import { compare, JsIterator, JsReverseIterator, KeyOnlyPolicy, KeyValuePolicy, NodeColors, ReverseIterator, Tree, TreeIterator, TreeMap, TreeMultiMap, TreeNode, TreeSet, TreeMultiSet, ValueOnlyPolicy } from '../../../dist/esm/jstreemap.js';",
  ]);
  await generatePreprodTests(
    srcDir,
    path.resolve(fullDestDir, 'browser-tests'),
    []
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
