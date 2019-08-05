import { platform } from 'os';
import * as child_process from 'child_process';
import { ChildProcess } from 'child_process';
const crossSpawn = require('cross-spawn');
const shellEscape = require('shell-escape');

export function rubySpawn(command: string, args: string[], opts = {}): ChildProcess {
	let cmd = [command].concat(args);
	if (platform().match(/darwin|linux/)) {
		// OSX and Linux need to use an explicit login shell in order to find
		// the correct Ruby environment through version managers like rvm and
		// rbenv.
		let shell = process.env.SHELL;
		if (!shell) {
			shell = '/bin/bash';
		}
		if (shell.endsWith('bash') || shell.endsWith('zsh')) {
			let shellCmd = shellEscape(cmd);
			if (opts['cwd']) {
				shellCmd = `${shellEscape(['cd', opts['cwd']])} && ${shellCmd}`;
			}
			let shellArgs = [shellCmd];
			shellArgs.unshift('-c');
			shellArgs.unshift('-l');
			return child_process.spawn(shell, shellArgs, opts);
		} else {
			return crossSpawn(cmd.shift(), cmd, opts);
		}
	} else {
		return crossSpawn(cmd.shift(), cmd, opts);
	}
}
