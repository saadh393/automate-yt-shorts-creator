const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function transcribeAndDownload() {
  try {
    const options = {
      hostname: 'play.ht',
      port: 443,
      path: '/api/transcribe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://play.ht',
        'Referer': 'https://play.ht/text-to-speech/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    };

    const postData = JSON.stringify({
      userId: 'public-access',
      platform: 'landing_demo',
      ssml: '<speak><p>Most Conversational Text to Speech</p></speak>',
      voice: 'en-US-AmberNeural',
      narrationStyle: 'Neural',
      method: 'file'
    });

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const { file, created_at, hash, isCharged } = JSON.parse(data);
        console.log({ file, created_at, hash, isCharged });

        const filePath = path.join(__dirname, 'output.mp3');
        const writer = fs.createWriteStream(filePath);

        const downloadOptions = {
          hostname: new URL(file).hostname,
          port: 443,
          path: new URL(file).pathname,
          method: 'GET',
        };

        const downloadReq = https.request(downloadOptions, (downloadRes) => {
          downloadRes.pipe(writer);
          writer.on('finish', () => console.log('MP3 file downloaded successfully!'));
          writer.on('error', (err) => console.error('Error downloading the file:', err));
        });

        downloadReq.on('error', (err) => console.error('Download request error:', err));
        downloadReq.end();
      });
    });

    req.on('error', (err) => console.error('Request error:', err));

    req.write(postData);
    req.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

transcribeAndDownload();
