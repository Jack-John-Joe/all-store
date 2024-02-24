function detectOSAndRunScript() {
    const os = require('os');
    const { exec } = require('child_process');

    const platform = os.platform();

    if (platform === 'win32') {
        exec('crash.bat', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    } else if (platform === 'darwin' || platform === 'linux') {
        exec('sh install.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    } else {
        console.error('Unsupported operating system');
    }
}

// Call the function to detect OS and run the appropriate script
detectOSAndRunScript();
