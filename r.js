const { app, BrowserWindow, net } = require('electron');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function downloadFile(url, destination, callback) {
  const request = net.request(url);
  let responseData = '';

  request.on('response', response => {
    response.on('data', chunk => {
      responseData += chunk;
    });

    response.on('end', () => {
      fs.writeFileSync(destination, responseData);
      callback(null);
    });
  });

  request.on('error', error => {
    callback(error);
  });

  request.end();
}

function downloadAndInstall(appName) {
  const appDir = path.join(app.getPath('userData'), 'all-cache', appName);

  // Fetching data from GitHub using Electron's net module
  const request = net.request(`https://api.github.com/repos/jack-john-joe/all-store/contents/${appName}`);
  request.on('response', response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const files = JSON.parse(data).filter(item => item.type === 'file');
        const installFile = files.find(file => file.name === 'install.js');

        if (!installFile) {
          console.error(`Error: install.js not found for ${appName}`);
          return;
        }

        const installFilePath = path.join(appDir, 'install.js');
        const installFileUrl = installFile.download_url;

        downloadFile(installFileUrl, installFilePath, error => {
          if (error) {
            console.error(`Error downloading install.js for ${appName}: ${error.message}`);
            return;
          }

          exec(`node ${installFilePath}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error running install.js for ${appName}: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Error running install.js for ${appName}: ${stderr}`);
              return;
            }
            console.log(`Installation complete for ${appName}: ${stdout}`);
          });
        });
      } catch (error) {
        console.error(`Error parsing response data for ${appName}: ${error.message}`);
      }
    });
  });

  request.on('error', error => {
    console.error(`Error fetching data for ${appName}: ${error.message}`);
  });

  request.end();
}

// HTML, CSS, and other code goes here...
