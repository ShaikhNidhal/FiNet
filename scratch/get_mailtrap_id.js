async function listInboxes() {
    const apiToken = '373cff19312826cb08d6129c5b0601f6';
    try {
        const response = await fetch('https://mailtrap.io/api/accounts', {
            headers: { 'Api-Token': apiToken }
        });
        const accounts = await response.json();
        console.log('Accounts:', JSON.stringify(accounts, null, 2));

        for (const account of accounts) {
            const inboxesResponse = await fetch(`https://mailtrap.io/api/accounts/${account.id}/inboxes`, {
                headers: { 'Api-Token': apiToken }
            });
            const inboxes = await inboxesResponse.json();
            console.log(`Inboxes for account ${account.id}:`, JSON.stringify(inboxes, null, 2));
        }
    } catch (err) {
        console.error('Error fetching inboxes:', err);
    }
}

listInboxes();
