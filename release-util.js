//
// Shared helpers for beta.js and release.js.
//
// Not published (see .npmignore). Both scripts honour --dry-run, which echoes
// every mutating command and runs only the read-only preflight checks.
//

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const kPackageJson = path.join(__dirname, 'package.json');
const kBetaPattern = /^(\d+)\.(\d+)\.(\d+)-beta\.(\d+)$/;
const kReleasePattern = /^\d+\.\d+\.\d+$/;

const dryRun = process.argv.includes('--dry-run');
const positionalArg = process.argv.slice(2).find((a) => !a.startsWith('--'));

// Commands
// ---------------------------------------------------------------------------
// |quiet| marks a read-only or preflight command that must run even on a dry
// run; everything else is only echoed when --dry-run is set.
function run(command, { quiet = false } = {}) {
  if (dryRun && !quiet) {
    console.log(`   [dry] ${command}`);
    return '';
  }
  return execSync(command, { cwd: __dirname, encoding: 'utf8' }).trim();
}

// ---------------------------------------------------------------------------
function git(args, options = {}) {
  return run(`git ${args}`, options);
}

// ---------------------------------------------------------------------------
// |quiet| runs it even on a dry run, for the preflight check that regenerates
// and then reverts. Leave it off for the mutating step, so --dry-run really
// changes nothing on disk.
function combine({ quiet = false } = {}) {
  run('npm run combine', { quiet });
}

// ---------------------------------------------------------------------------
// Runs one mutating step. A failure here can leave the repo part-way through,
// so report where it stopped and on which branch rather than letting the raw
// git error surface as a stack trace.
function step(label, action) {
  try {
    action();
  } catch (err) {
    console.error(`\n❌ failed while trying to: ${label}`);
    console.error(`   git says: ${firstLine(err.stderr ?? err.message)}`);
    console.error(`\n   Currently on branch: ${safeCurrentBranch()}`);
    console.error(`   Nothing after this step ran. Resolve the error above,`);
    console.error(`   then finish by hand or reset and re-run.\n`);
    process.exit(1);
  }
}

// Preconditions
// ---------------------------------------------------------------------------
// The scripts regenerate types.d.ts in the working tree, so the tree has to
// hold the content being published.
function requireOnBranch(expected) {
  const branch = safeCurrentBranch();
  if (branch !== expected) {
    fail(`run this from the ${expected} branch (currently on ${branch}).`);
  }
}

// ---------------------------------------------------------------------------
// types.d.ts is excluded: both scripts regenerate it, and on a Windows clone
// with core.autocrlf a stray `npm run combine` leaves it flagged as modified
// with no content change at all, which would refuse for no reason.
function requireCleanTree() {
  // Filtered here rather than with a git pathspec: cmd.exe does not strip the
  // quotes a ':(exclude)' pathspec needs, so it fails on Windows.
  // The status letters are stripped by regex, not by column offset: run()
  // trims its output, which drops the leading space of an unstaged entry.
  const dirty = git('status --porcelain', { quiet: true })
    .split('\n')
    .map((line) => line.replace(/^\s*\S+\s+/, '').trim())
    .filter((path) => path && path !== 'types.d.ts');

  if (dirty.length) {
    fail(
      'working tree is not clean.\n' +
        '   Commit your modules/*.d.ts change first, then re-run.',
    );
  }
}

// ---------------------------------------------------------------------------
// True when types.d.ts differs in content from what is committed. Uses diff,
// not status: status compares raw bytes and reports a line-ending-only
// difference as a modification, while diff applies the same normalisation a
// commit would and correctly reports no change.
function hasTypesContentChange() {
  try {
    git('diff --quiet -- types.d.ts', { quiet: true });
    return false;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Local commits not yet pushed are expected and fine; unpulled remote commits
// are not, because the push at the end would be rejected.
function requireNotBehindOrigin(branch) {
  try {
    git(`merge-base --is-ancestor origin/${branch} ${branch}`, {
      quiet: true,
    });
  } catch {
    fail(`origin/${branch} has commits you do not have. Pull first.`);
  }
}

// ---------------------------------------------------------------------------
function requireInSyncWithOrigin(branch) {
  const local = git(`rev-parse ${branch}`, { quiet: true });
  const remote = git(`rev-parse origin/${branch}`, { quiet: true });
  if (local !== remote) {
    fail(`${branch} and origin/${branch} differ. Pull or push first.`);
  }
}

// ---------------------------------------------------------------------------
// The whole branch model rests on this: if main ever grew a commit beta does
// not have, the release fast-forwards fail and package.json conflicts.
function requireMainIsAncestorOfBeta() {
  try {
    git('merge-base --is-ancestor main beta', { quiet: true });
  } catch {
    fail(
      'main is not an ancestor of beta, so the fast-forwards would fail.\n' +
        '   The branches have diverged; realign beta onto main first.',
    );
  }
}

// ---------------------------------------------------------------------------
// CI skips publishing a version that already exists, which would silently
// leave the dist-tag pointing at the previous version.
function requireNotPublished(name, version) {
  try {
    execSync(`npm view ${name}@${version} version`, { stdio: 'ignore' });
  } catch {
    return; // not found, which is what we want
  }
  fail(`${name}@${version} is already published. Pick a different version.`);
}

// Versions
// ---------------------------------------------------------------------------
function readPackageJson() {
  return JSON.parse(fs.readFileSync(kPackageJson, 'utf8'));
}

// ---------------------------------------------------------------------------
function versionOnBranch(branch) {
  return JSON.parse(git(`show ${branch}:package.json`, { quiet: true }))
    .version;
}

// ---------------------------------------------------------------------------
// Beta versions name the *next* release, never the last one: a prerelease
// sorts below its own version, so 1.1.11-beta.0 published after 1.1.11 would
// be semver-older than what is already on @latest.
function parseBetaVersion(version) {
  const match = kBetaPattern.exec(version);
  if (!match) {
    fail(
      `beta is on '${version}', which is not a x.y.z-beta.N prerelease.\n` +
        `   Release versions belong on main only. Fix beta's version first.`,
    );
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: Number(match[4]),
  };
}

// ---------------------------------------------------------------------------
// Rewrites only the version value, so the file's own formatting survives.
function setVersion(version) {
  if (dryRun) {
    console.log(`   [dry] set version ${version}`);
    return;
  }

  const raw = fs.readFileSync(kPackageJson, 'utf8');
  const next = raw.replace(/("version":\s*")[^"]*(")/, `$1${version}$2`);
  if (next === raw) {
    fail('could not rewrite the version field in package.json.');
  }
  fs.writeFileSync(kPackageJson, next);
}

// Helpers
// ---------------------------------------------------------------------------
function safeCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: __dirname,
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

// ---------------------------------------------------------------------------
function firstLine(text) {
  return String(text ?? 'no error output')
    .trim()
    .split('\n')[0];
}

// ---------------------------------------------------------------------------
function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

module.exports = {
  kBetaPattern,
  kReleasePattern,
  dryRun,
  positionalArg,
  run,
  git,
  combine,
  step,
  requireOnBranch,
  requireCleanTree,
  hasTypesContentChange,
  requireNotBehindOrigin,
  requireInSyncWithOrigin,
  requireMainIsAncestorOfBeta,
  requireNotPublished,
  readPackageJson,
  versionOnBranch,
  parseBetaVersion,
  setVersion,
  fail,
};
