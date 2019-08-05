"use strict";

import 'mocha';
import { expect } from 'chai';
import { rubySpawn } from '../index';
import * as path from 'path';
import { platform } from 'os';

suite('rubySpawn', () => {
    it('spawns a Ruby process', (done) => {
		let script = path.resolve('.', 'fixtures', 'script.rb');
		let child = rubySpawn('ruby', [script]);
		child.on('close', (code) => {
			expect(code).to.equal(0);
			done();
		});
	});

	it('sets the current directory', (done) => {
		let script = path.resolve('.', 'fixtures', 'cwd.rb');
		let dir = path.resolve('.', 'fixtures');
		let child = rubySpawn('ruby', [script], { cwd: dir });
		let out = '';
		child.stdout.on('data', (buffer) => {
			out = out + buffer.toString();
		});
		child.stdout.on('close', () => {
			expect(path.normalize(out)).to.equal(dir);
			done();
		});
	});

	it('sets a foreign directory', (done) => {
		let script = path.resolve('.', 'fixtures', 'cwd.rb');
		let dir = path.resolve('.');
		let child = rubySpawn('ruby', [script], { cwd: dir });
		let out = '';
		child.stdout.on('data', (buffer) => {
			out = out + buffer.toString();
		});
		child.stdout.on('close', () => {
			expect(path.normalize(out)).to.equal(dir);
			done();
		});
	});

	if (platform().match(/darwin|linux/)) {

		it('spawns a Ruby process', (done) => {
			let script = path.resolve('.', 'fixtures', 'script.rb');
			let child = rubySpawn('ruby', [script]);
			child.on('close', (code) => {
				expect(code).to.equal(0);
				done();
			});
		});

	}
});
