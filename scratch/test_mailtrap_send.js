async function testSend() {
    const apiToken = '373cff19312826cb08d6129c5b0601f6';
    const inboxId = '4597100';
    const apiUrl = `https://sandbox.api.mailtrap.io/api/send/${inboxId}`;

    const body = {
        from: { email: 'no-reply@finet.ai', name: 'FiNet Test' },
        to: [{ email: 'test@example.com' }],
        subject: 'Sandbox Test',
        html: '<h1>It Works!</h1>',
        category: 'Test'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Api-Token': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testSend();
