export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://nothotmilk.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { url } = req.body;
    const apiKey = process.env.TINYURL_API_KEY;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const response = await fetch('https://api.tinyurl.com/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ url: url }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors.join(', ') || 'Failed to create TinyURL');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}