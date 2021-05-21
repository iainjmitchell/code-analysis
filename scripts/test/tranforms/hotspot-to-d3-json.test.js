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

test('converted two root records with equal split of weight', async() => {
    const records = [
        { module: 'file1.js', revisions: 50, code: 100 },
        { module: 'file2.js', revisions: 50, code: 200 },
    ]
    
    const hotspotCSVData = [
        'module,revisions,code',
        `${records[0].module},${records[0].revisions},${records[0].code}`,
        `${records[1].module},${records[1].revisions},${records[1].code}`
    ].join(EOL);

    await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({
        "name": ".",
        "children": [
            {"size": records[0].code, "name": records[0].module, "weight": 0.5},
            {"size": records[1].code, "name": records[1].module, "weight": 0.5}
        ]
    });
});

test('converted two root records with unequal split of weight', async() => {
    const records = [
        { module: 'file1.js', revisions: 150, code: 100 },
        { module: 'file2.js', revisions: 50, code: 200 },
    ]
    
    const hotspotCSVData = [
        'module,revisions,code',
        `${records[0].module},${records[0].revisions},${records[0].code}`,
        `${records[1].module},${records[1].revisions},${records[1].code}`
    ].join(EOL);

    await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({
        "name": ".",
        "children": [
            {"size": records[0].code, "name": records[0].module, "weight": 0.75},
            {"size": records[1].code, "name": records[1].module, "weight": 0.25}
        ]
    });
});

const parseString = require('@fast-csv/parse').parseString;

class HotspotToD3Json {
    static async transform(hotspotCSVData) {
        const csvData = await HotspotToD3Json._parseCSVData(hotspotCSVData);
        const totalNumberOfRevisions = csvData.reduce((accumilator, csvRow) => accumilator + parseInt(csvRow.revisions), 0);
        return {
            "name": ".",
            "children": csvData.map(csvRow => HotspotToD3Json._convertRow(csvRow, totalNumberOfRevisions))
        };
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

    static _convertRow(csvDataRow, totalNumberOfRevisions){
        const revisions = parseInt(csvDataRow.revisions);
        const weight = (revisions / totalNumberOfRevisions);
        return {"size": parseInt(csvDataRow.code), "name": csvDataRow.module, "weight": weight};
    }
}