#!/usr/bin/env node
//
// Promotes the current beta to a release, then reopens the next beta.
//
//   npm run release                 1.1.12-beta.3 -> release 1.1.12,
//                                   next beta 1.1.13-beta.0
//   npm run release -- 1.2.0        release that version instead
//   npm run release -- --dry-run
//
// Publishing is done by .github/workflows/npm-publish.yml, which fires on a
// package.json change; this script only moves the branches and the versions.
//
// The invariant it preserves: main is always an ancestor of beta. Release
// versions are only ever authored on main, prereleases only on beta, so
// package.json can never conflict between them.

const u = require('./release-util');

// ---------------------------------------------------------------------------
function main() {
  const plan = buildPlan();

  console.log(`\n📦 ${plan.name}`);
  console.log(`   beta now:  ${plan.currentBeta}`);
  console.log(`   release:   ${plan.release}   -> npm @latest`);
  console.log(`   next beta: ${plan.nextBeta}   -> npm @beta`);
  console.log(u.dryRun ? '\n-- dry run, nothing will change --\n' : '');

  // main catches up to beta, then takes the release version. One push, so CI
  // runs once and publishes @latest.
  u.step('fast-forward main to beta', () => {
    u.git('checkout main');
    u.git('merge --ff-only beta');
  });
  u.step(`bump main to ${plan.release}`, () => {
    u.setVersion(plan.release);
    u.git('add package.json');
    u.git(`commit -m "Update version to ${plan.release}"`);
  });
  u.step('push main', () => u.git('push origin main'));

  // beta catches up to main (fast-forward, no version change), then opens the
  // next prerelease. Second push, CI publishes @beta.
  u.step('fast-forward beta to main', () => {
    u.git('checkout beta');
    u.git('merge --ff-only main');
  });
  u.step(`bump beta to ${plan.nextBeta}`, () => {
    u.setVersion(plan.nextBeta);
    u.git('add package.json');
    u.git(`commit -m "Update version to ${plan.nextBeta}"`);
  });
  u.step('push beta', () => u.git('push origin beta'));

  console.log(`\n✅ ${plan.release} pushed to main, ${plan.nextBeta} to beta.`);
  console.log('   CI publishes both; watch the Actions tab.\n');
}

// ---------------------------------------------------------------------------
// Runs every precondition, then returns the three version numbers. Nothing is
// mutated before this returns.
function buildPlan() {
  u.requireOnBranch('beta');
  u.requireCleanTree();
  u.git('fetch origin --prune', { quiet: true });
  u.requireInSyncWithOrigin('main');
  u.requireInSyncWithOrigin('beta');
  u.requireMainIsAncestorOfBeta();

  const name = u.readPackageJson().name;
  const currentBeta = u.versionOnBranch('beta');
  const { release, nextBeta } = resolveVersions(currentBeta);

  requireFreshTypes();
  u.requireNotPublished(name, release);
  return { name, currentBeta, release, nextBeta };
}

// ---------------------------------------------------------------------------
function resolveVersions(currentBeta) {
  const { major, minor, patch } = u.parseBetaVersion(currentBeta);
  const release = u.positionalArg ?? `${major}.${minor}.${patch}`;
  if (!u.kReleasePattern.test(release)) {
    u.fail(`'${release}' is not a x.y.z release version.`);
  }

  const [a, b, c] = release.split('.').map(Number);
  return { release, nextBeta: `${a}.${b}.${c + 1}-beta.0` };
}

// ---------------------------------------------------------------------------
// A release must not ship a types.d.ts that disagrees with modules/*.d.ts:
// it is the only file the package ships, and the docs pipeline generates its
// API reference from the published copy. `npm run beta` keeps these in step,
// so a mismatch here means something was committed by hand.
function requireFreshTypes() {
  u.combine({ quiet: true });
  const stale = u.hasTypesContentChange();

  // Restore either way: combine rewrites the file with LF, and leaving that
  // behind would make the branch switches below trip over a dirty tree.
  u.git('checkout -- types.d.ts', { quiet: true });
  if (stale) {
    u.fail(
      'types.d.ts does not match modules/*.d.ts.\n' +
        '   Run `npm run beta` to regenerate and publish a prerelease first.',
    );
  }
}

main();
