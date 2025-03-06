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

    const moveItem = async (up, item) => {
        const itemIndex = items.indexOf(item);

        if (up && itemIndex > 0) {
            [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]]
        } else if (!up && itemIndex < items.length - 1) {
            [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]]
        }
        await browser.storage.local.set({ pins: items });

        renderListItems();
    }

    const createSpan = (content, className, action) => {
        let span = document.createElement('span');
        let spanText = document.createTextNode(content);
        span.className = className;
        span.appendChild(spanText);
        span.addEventListener('click', action);

        return span;
    }

    const renderListItems = () => {
        pinnedItems.innerHTML = '';

        for (let item of items) {
            // Create list item
            let li = document.createElement('li');
            let textSpan = document.createElement('span');
            let text = document.createTextNode(item);
            textSpan.appendChild(text);
            textSpan.className = 'text';
            li.appendChild(textSpan);

            // Create delete button
            const deleteButton = createSpan('\u00D7', 'remove', () => removeItem(item));
            const upButton = createSpan('\u25B2', 'up', () => moveItem(true, item));
            const downButton = createSpan('\u25BC', 'down', () => moveItem(false, item));
            
            if (items.length > 2) {
                li.appendChild(upButton);
                li.appendChild(downButton);
            }
            li.appendChild(deleteButton);

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