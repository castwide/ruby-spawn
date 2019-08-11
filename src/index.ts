import { platform } from 'os';
import * as child_process from 'child_process';
import { ChildProcess } from 'child_process';
const crossSpawn = require('cross-spawn');
const shellEscape = require('shell-escape');

let kill = function (child: ChildProcess, command: string) {
	let ps = child_process.spawn('ps', ['-o', 'pid,ppid,tty', '-C', command]);
	let out = '';
	ps.stdout.on('data', (buffer: Buffer) => {
		out += buffer.toString();
	});
	ps.on('exit', () => {
		let lines = out.split("\n");
		lines.shift();
		lines.pop();
		let nums = lines.filter((l) => {
			return l.match(/1[\s]+\?$/);
		}).map((l) => {
			return l.trim().split(' ')[0]
		});
		if (lines.length > 0) {
			child_process.spawn('kill', ['-9'].concat(nums));
		}
	});
}

export function rubySpawn(command: string, args: string[], opts = {}, forceKill = false): ChildProcess {
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
			let finalCmd = shellCmd;
			if (opts['cwd']) {
				finalCmd = `${shellEscape(['cd', opts['cwd']])} && ${shellCmd}`;
			}
			let shellArgs = [finalCmd];
			shellArgs.unshift('-c');
			shellArgs.unshift('-l');
			let child = child_process.spawn(shell, shellArgs, opts);
			if (forceKill) {
				child.on('exit', (code, signal) => {
					kill(child, ['ruby', command].concat(args).join(' '));
				});
			}
			return child;
		} else {
			return crossSpawn(cmd.shift(), cmd, opts);
		}
	} else {
		return crossSpawn(cmd.shift(), cmd, opts);
	}
}
