const HotspotToD3Json = require('./src/transforms/hotspot-to-d3-json.js');
const fs = require('fs');

const hotSpotData = fs.readFileSync(0, 'utf-8');
HotspotToD3Json
    .transform(hotSpotData)
    .then(convertedData => {
        process.stdout.write(JSON.stringify(convertedData));
    });