(async () => {
    if (typeof browser == "undefined") {
        // Chrome does not support the browser namespace yet.
        globalThis.browser = chrome;
    }

    // Get items from preference page
    const addButton = document.getElementById('addButton');
    const pinnedItems = document.getElementById('pinned-items');
    const itemInputField = document.getElementById('item-input-field');
    const inputError = document.getElementById('input-error');

    let items = (await browser.storage.local.get('pins')).pins || [];

    const removeItem = async (item) => {
        const itemIndex = items.indexOf(item);

        if (itemIndex >= 0) {
            items.splice(itemIndex, 1);

            await browser.storage.local.set({ pins: items });
        }

        renderListItems();
    }

    const renderListItems = () => {
        pinnedItems.innerHTML = '';

        for (let item of items) {
            // Create list item
            let li = document.createElement('li');
            let liText = document.createTextNode(item);
            li.appendChild(liText);

            // Create delete button
            let span = document.createElement('span');
            let spanText = document.createTextNode('\u00D7');
            span.className = 'remove';
            span.appendChild(spanText);
            span.addEventListener('click', () => removeItem(item));
            li.appendChild(span);

            pinnedItems.appendChild(li);
        }
    }

    // Register Event listeners
    addButton.addEventListener('click', async () => {
        const inputValue = itemInputField.value;
        try {
            const url = new URL(inputValue);
            inputError.innerText = "";
            
            if (items.indexOf(url.href) == -1 ) {
                items = [...items, url.href];
                await browser.storage.local.set({ pins: items });
                renderListItems();

                itemInputField.value = '';
            }
        } catch (e) {
            console.log(e);
            inputError.innerText = "Invalid url";
        }
    });

    renderListItems();
})();