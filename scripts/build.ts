// eslint-disable-next-line import/no-extraneous-dependencies
import shell from 'shelljs';
import * as build from '../build.json';

/**
 * Copy folders recursively.
 */
if (build.copy.folders.length > 0) shell.cp('-R', build.copy.folders, build.target);

/**
 * Copy files.
 */
if (build.copy.files.length > 0) shell.cp(build.copy.files, build.target);
