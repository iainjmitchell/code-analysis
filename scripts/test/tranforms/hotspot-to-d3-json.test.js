const EOL = require('os').EOL;

const testCases = [
    { module: 'file1.js', revisions: 50, code: 1341 },
    { module: 'file2.js', revisions: 80, code: 9999 }
];
testCases.forEach((testCase) => {
    test('converted one record with 100% of weight', async() => {
        const hotspotCSVData = [
            'module,revisions,code',
            `${testCase.module},${testCase.revisions},${testCase.code}`
        ].join(EOL);
    
        await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({"size": testCase.code, "name": testCase.module, "weight": 1});
    })
});

const parseString = require('@fast-csv/parse').parseString;

class HotspotToD3Json {
    static async transform(hotspotCSVData) {
        const csvData = await HotspotToD3Json._parseCSVData(hotspotCSVData);
        return HotspotToD3Json._convertRow(csvData[0]);
    }

    static async _parseCSVData(hotspotCSVData){
        const rows = [];
        return new Promise((resolve, reject) => {
            parseString(hotspotCSVData, { headers: true })
                .on('data', row => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', reject);
        });
    }

    static _convertRow(csvDataRow){
        return {"size": parseInt(csvDataRow.code), "name": csvDataRow.module, "weight": 1}
    }
}