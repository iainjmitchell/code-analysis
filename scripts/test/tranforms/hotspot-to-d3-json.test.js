const EOL = require('os').EOL;

const testCases = [
    { module: 'file1.js', revisions: 50, code: 1341 },
    { module: 'file2.js', revisions: 80, code: 9999 }
];
testCases.forEach((testCase) => {
    test('converted one root record with 100% of weight', async() => {
        const hotspotCSVData = [
            'module,revisions,code',
            `${testCase.module},${testCase.revisions},${testCase.code}`
        ].join(EOL);
    
        await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({
            "name": ".",
            "children": [
                {"size": testCase.code, "name": testCase.module, "weight": 1}
            ]
        });
    });
});

// test('converted two records with equal split of weight', async() => {
//     const records = [
//         { module: 'file1.js', revisions: 50, code: 100 },
//         { module: 'file2.js', revisions: 50, code: 200 },
//     ]
    
//     const hotspotCSVData = [
//         'module,revisions,code',
//         `${record[0].module},${record[0].revisions},${record[0].code}`,
//         `${record[1].module},${record[1].revisions},${record[1].code}`
//     ].join(EOL);

//     await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({"size": testCase.code, "name": testCase.module, "weight": 1});
// });

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
        return {
            "name": ".",
            "children": [
                {"size": parseInt(csvDataRow.code), "name": csvDataRow.module, "weight": 1}
            ]
        }
    }
}