// eslint-disable-next-line import/no-extraneous-dependencies
import shell from 'shelljs';
import * as build from '../build.json';

// Copy Folders
if (build.copy.folders.length > 0) shell.cp('-R', build.copy.folders, build.target);

// Copy Files
if (build.copy.files.length > 0) shell.cp(build.copy.files, build.target);
