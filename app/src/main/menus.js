import {app, Menu, shell, dialog} from 'electron';
import settings from 'electron-settings';
import AutoLauch from 'auto-launch';

const signInForUpdates = {
  label: 'Sign up for updates',
  click: () => shell.openExternal('http://eepurl.com/ch90_1')
};

const kapLauncher = new AutoLauch({
  name: 'kap'
});

function startupLaunch() {
  kapLauncher.isEnabled().then(result => {
    if (result === false) {
      kapLauncher.enable();
      settings.setSync('kap-launch', true);
    } else {
      kapLauncher.disable();
      settings.setSync('kap-launch', false);
    }
  });
}

function changeSaveToDirectory() {
  const location = dialog.showOpenDialog({properties: ['openDirectory']});
  if (location) {
    settings.set('save-to-directory', location[0]);
  }
}

const cogMenu = [
  {
    role: 'about'
  },
  {
    type: 'separator'
  },
  {
    label: 'Save to...',
    click: () => changeSaveToDirectory()
  },
  {
    label: 'Open on startup',
    type: 'checkbox',
    checked: settings.getSync('kap-launch'),
    click: () => startupLaunch()
  },
  {
    type: 'separator'
  },
  signInForUpdates,
  {
    type: 'separator'
  },
  {
    role: 'quit',
    id: 'quit'
  }
];

const applicationMenu = [
  {
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      signInForUpdates,
      {
        label: 'Contribute',
        click: () => shell.openExternal('https://github.com/wulkano/kap')
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Recording',
        accelerator: 'CmdOrCtrl+N',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('prepare-recording');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Save to...',
        click: () => changeSaveToDirectory()
      },
      {
        type: 'separator'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          app.mainWindow.hide();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (focusedWindow.isDevToolsOpened()) {
              focusedWindow.closeDevTools();
            } else {
              focusedWindow.openDevTools({mode: 'detach'});
            }
          }
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Kap Website',
        click: () => shell.openExternal('https://getkap.co')
      },
      {
        label: 'GitHub repository',
        click: () => shell.openExternal('https://github.com/wulkano/kap')
      }
    ]
  }
];

exports.applicationMenu = Menu.buildFromTemplate(applicationMenu);
exports.cogMenu = Menu.buildFromTemplate(cogMenu);
