const fs = require('fs');
const path = require('path');
const electron = require('electron');
require('../server');

const { app, BrowserWindow, ipcMain, Menu } = electron;

let mainWindow;

const indexUrl = 'http://localhost:3000/index.html';

let sampleFilename = 'structures.json';

function reload(filename) {
    sampleFilename = filename;
    mainWindow.loadURL(indexUrl);
}

const menuTemplate = [
    {
        label: 'File',
        submenu: fs.readdirSync(path.resolve(__dirname, '../src/samples/')).map(i => ({
            label: i,
            click() {
                reload(i);
            },
        })),
    },
];
if (process.platform === 'darwin') {
    const name = app.getName();
    menuTemplate.unshift(
        {
            label: name,
            submenu: [
                {
                    label: `About ${name}`,
                    role: 'about',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: [],
                },
                {
                    type: 'separator',
                },
                {
                    label: `Hide ${name}`,
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers',
                },
                {
                    label: 'Show All',
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click() {
                        app.quit();
                    },
                },
            ],
        });
}

const menu = Menu.buildFromTemplate(menuTemplate);

function createWindow() {
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
    });
    mainWindow.setMenu(menu);
    mainWindow.loadURL(indexUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('ready', () => {
    const samples = fs.readFileSync(path.resolve(__dirname, `../src/samples/${sampleFilename}`),
        { encoding: 'utf8' });
    mainWindow.webContents.send('set-sample-data', samples);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
