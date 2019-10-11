const { spawn } = require('child_process')


async function test () {
    const find = spawn('find', ['./files', '-type', 'f', '-name', '6 *']);
    const wc = spawn('wc', ['-l']);
    
    find.stdout.pipe(wc.stdin);
    
    for await (const data of wc.stdout) {
      console.log(`number of files: ${data}`);
    };
}

test();