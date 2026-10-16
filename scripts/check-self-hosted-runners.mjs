import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const directory = new URL('../.github/workflows/', import.meta.url)
const files = readdirSync(directory).filter(name => /\.ya?ml$/.test(name))
assert.ok(files.length, 'No Actions workflows found')
for (const file of files) {
  const contents = readFileSync(new URL(file, directory), 'utf8')
  const runners = [...contents.matchAll(/^\s*runs-on:\s*(.+)$/gm)].map(([, value]) => value.trim())
  assert.ok(runners.length, 'Missing runner in ' + file)
  for (const value of runners) assert.equal(value, '[self-hosted, Linux]', 'Unsafe runner in ' + file)
  assert.doesNotMatch(contents, /(?:ubuntu|windows|macos)-latest|CALENDRA_TEST_RUNNER|inputs\.runner/, file)
}
const ci = readFileSync(new URL('ci.yml', directory), 'utf8')
assert.match(ci, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/,
  'Public fork pull requests must not run on self-hosted machines')
console.log('PASS: all website jobs are local self-hosted Linux only; fork PRs are blocked.')
