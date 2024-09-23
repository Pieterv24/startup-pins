# Startup Pins
This extension changes the behaviour of pinned tabs.
I had issues with pinned tabs reopening on browser restart.

This extension lets you set a list of pinned tabs that should be opened at startup.

## Usage
### Firefox
go to "about:addons".  
Click on the "Startup Pins" addon.  
Go to the "preferences" tab.  

Add the urls you want pinned at startup.

## Known issues
"about:" tabs do not work with this extension.  
These can be pinned in the regular way and the extension will not override this behaviour.

## Building
```
npm install
npm run build
```
after this the addon will be available in the 'web-ext-artifacts' folder