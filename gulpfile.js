// grab our gulp packages
import { execSync } from 'child_process';

import { deleteSync } from 'del';
import gulp from 'gulp';
import PluginError from 'plugin-error';

function runCmd(taskName, cmd) {
  try {
    execSync(cmd, { stdio: [0, 1, 2] });
  } catch (error) {
    throw new PluginError({
      plugin: taskName,
      message: error.message,
    });
  }
}

gulp.task('clean', function cleanTask(done) {
  deleteSync(['./build', './dist', './docs']);
  done();
});

gulp.task('build', function buildTask(done) {
  runCmd('eslint', 'npm run eslint-fix');
  runCmd('dev-test', 'npm run dev-test');
  runCmd('analyze-tests', 'npm run analyze-tests');
  runCmd('jsdoc', 'npm run jsdoc');
  runCmd('compile', 'npm run compile');
  runCmd('webpack', 'npm run webpack');
  runCmd('generate-tests', 'npm run generate-tests');
  runCmd('preprod-esm-tests', 'npm run preprod-esm-tests');
  runCmd('preprod-umd-tests', 'npm run preprod-umd-tests');
  runCmd('web-test', 'npm run web-test');
  done();
});

gulp.task(
  'default',
  gulp.series('build', function defaultTask(done) {
    done();
  })
);
