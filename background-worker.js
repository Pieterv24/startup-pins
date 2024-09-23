if (typeof browser == "undefined") {
    // Chrome does not support the browser namespace yet.
    globalThis.browser = chrome;
}

browser.runtime.onStartup.addListener(async () => {
    // First close all pinned tabs that are not "about" tabs
    const tabs = (await browser.tabs.query({pinned: true})).filter(tab => tab.url.substring(0, 6).toLowerCase() !== 'about:');
    await browser.tabs.remove(tabs.map(tab => tab.id));

    // Get the startup tabs from local storage
    const startupTabs = (await browser.storage.local.get('pins')).pins || [];

    // Open startup tabs
    const tabCreations = [];
    startupTabs.forEach((pin) => {
        tabCreations.push(browser.tabs.create({url: pin, pinned: true, active: false}));
    });
    // Wait for all tabs to open.
    await Promise.all(tabCreations);

    const firstTab = (await browser.tabs.query({index: 0}))[0];
    await browser.tabs.update(firstTab.id, {active: true});

    const newTabs = (await browser.tabs.query({pinned: false})).filter(tab => tab.url === 'about:home' || tab.url === 'about:newtab');
    await browser.tabs.remove(newTabs.map(tab => tab.id));

    browser.tabs.onUpdated.addListener(async (id, info, tab) => {
        if (info.pinned && tab.url.substring(0,6).toLowerCase() !== "about:") {
            const startupTabs = (await browser.storage.local.get('pins')).pins || [];
    
            await browser.storage.local.set({pins: [...startupTabs, tab.url]});
        }
    });
});