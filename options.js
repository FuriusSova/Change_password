const LAUNCH_PUPPETEER_OPTS = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
    ],
    defaultViewport: {
        width: 1920,
        height: 1080
    }
};

const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
};

module.exports = {
    LAUNCH_PUPPETEER_OPTS,
    PAGE_PUPPETEER_OPTS
}