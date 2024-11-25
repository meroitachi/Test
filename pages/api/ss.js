import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    let browser = null;

    try {
        // Launch the browser
        browser = await puppeteer.launch({
            executablePath: await chrome.executablePath,
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            headless: chrome.headless,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); // Fully render the page

        // Take a screenshot
        const screenshot = await page.screenshot({ fullPage: true });

        // Return the screenshot as a response
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
