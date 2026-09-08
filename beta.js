#!/usr/bin/env node
//
// Publishes the current state of beta as the next prerelease.
//
//   npm run beta                    1.1.12-beta.0 -> 1.1.12-beta.1
//   npm run beta -- 1.2.0-beta.0    jump to a new series
//   npm run beta -- --dry-run
//
// Commit your modules/*.d.ts change first; this script only does the
// mechanical part: regenerate types.d.ts, bump the prerelease, commit, push.
// The push is what publishes - .github/workflows/npm-publish.yml fires on a
// package.json change and publishes beta under the @beta tag.

const u = require('./release-util');

// ---------------------------------------------------------------------------
function main() {
  const plan = buildPlan();

  console.log(`\n📦 ${plan.name}`);
  console.log(`   now:  ${plan.current}`);
  console.log(`   next: ${plan.next}   -> npm @beta`);
  console.log(u.dryRun ? '\n-- dry run, nothing will change --\n' : '');

  u.step('regenerate types.d.ts', () => u.combine());
  u.step(`bump beta to ${plan.next}`, () => {
    u.setVersion(plan.next);
    u.git('add package.json types.d.ts');
    u.git(`commit -m "Update version to ${plan.next}"`);
  });
  u.step('push beta', () => u.git('push origin beta'));

  console.log(`\n✅ ${plan.next} pushed to beta.`);
  console.log('   CI publishes it as @beta; watch the Actions tab.\n');
}

// ---------------------------------------------------------------------------
// Runs every precondition, then returns the version numbers. Nothing is
// mutated before this returns.
function buildPlan() {
  u.requireOnBranch('beta');
  u.requireCleanTree();
  u.git('fetch origin --prune', { quiet: true });
  u.requireNotBehindOrigin('beta');

  const name = u.readPackageJson().name;
  const current = u.versionOnBranch('beta');
  const next = resolveNextVersion(current);

  u.requireNotPublished(name, next);
  return { name, current, next };
}

// ---------------------------------------------------------------------------
function resolveNextVersion(current) {
  const parts = u.parseBetaVersion(current);
  if (!u.positionalArg) {
    const { major, minor, patch, prerelease } = parts;
    return `${major}.${minor}.${patch}-beta.${prerelease + 1}`;
  }

  if (!u.kBetaPattern.test(u.positionalArg)) {
    u.fail(`'${u.positionalArg}' is not a x.y.z-beta.N prerelease version.`);
  }
  return u.positionalArg;
}

main();
