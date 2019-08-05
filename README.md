# ruby-spawn

A cross-platform function for spawning Ruby processes.

## How It Works

Systems that use rvm or rbenv have special needs for running Ruby. The process needs to be spawned in an appropriate shell (usually bash or zsh), and the shell needs to perform its own directory change (setting `cwd` in the process options is not enough). `rubySpawn` automates the steps required to execute the process. The return value is a standard `ChildProcess`, so `rubySpawn` is a simple drop-in replacement for `ChildProcess.spawn`. It works on Linux, MacOS, and Windows.

## Usage

Import the function:

```
// JavaScript
const rubySpawn = require('ruby-spawn');

// TypeScript
import { RubySpawn } from 'ruby-spawn';
```

Examples:

```
// Run a script in the current directory
rubySpawn('ruby', ['./script.rb'])

// Run a script in a different directory
rubySpawn('ruby', ['./script.rb'], { cwd: '/path/to/directory' });

// Run Bundler in a different directory
rubySpawn('bundle', ['install'], { cwd: '/path/to/directory' });

// Run RSpec in a different directory
rubySpawn('rspec', ['/path/to/directory'], { cwd: '/path/to/directory' });
```
