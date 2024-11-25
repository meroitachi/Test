const { chromium } = require('playwright');

async function ss(url) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
}

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }


    try {


       const screenshot=await ss(url)
       res.setHeader('Content-Type', 'image/png');
        res.status(200).send(screenshot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to take screenshot' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
