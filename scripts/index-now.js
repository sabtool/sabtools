const fs = require('fs');
const path = require('path');

const KEY = '7abead04d3ac4724bae8ac801d060729';
const HOST = 'sabtools.in';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://www.bing.com/indexnow';
const BATCH_SIZE = 100;

async function main() {
  // Read and parse sitemap.xml
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

  // Extract all <loc> URLs
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemap)) !== null) {
    urls.push(match[1].trim());
  }

  console.log(`Found ${urls.length} URLs in sitemap.xml`);

  if (urls.length === 0) {
    console.log('No URLs found. Exiting.');
    return;
  }

  // Send URLs in batches of 100
  let totalSubmitted = 0;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE);

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    try {
      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 202) {
        console.log(`Batch ${batchNum}/${totalBatches}: Submitted ${batch.length} URLs (status: ${response.status})`);
        totalSubmitted += batch.length;
      } else {
        const text = await response.text();
        console.error(`Batch ${batchNum}/${totalBatches}: Failed (status: ${response.status}) - ${text}`);
      }
    } catch (err) {
      console.error(`Batch ${batchNum}/${totalBatches}: Error - ${err.message}`);
    }
  }

  console.log(`\nDone! Total URLs submitted: ${totalSubmitted}/${urls.length}`);
}

main().catch(console.error);
