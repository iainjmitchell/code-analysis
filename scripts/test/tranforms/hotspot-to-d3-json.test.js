const EOL = require('os').EOL;
const HotspotToD3Json = require('../../src/transforms/hotspot-to-d3-json');

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
            name: 'root',
            children: [
                {size: testCase.code, name: testCase.module, weight: 1}
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
        name: 'root',
        children: [
            {size: records[0].code, name: records[0].module, weight: 0.5},
            {size: records[1].code, name: records[1].module, weight: 0.5}
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
        name: 'root',
        children: [
            {size: records[0].code, name: records[0].module, weight: 0.75},
            {size: records[1].code, name: records[1].module, weight: 0.25}
        ]
    });
});

test('one record within a folder', async() => {
    const hotspotCSVData = [
        'module,revisions,code',
        'src/bob.js,30,123'
    ].join(EOL);

    await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({
        name: 'root',
        children: [{
            name: 'src',
            children: [
                {size: 123, name: 'bob.js', weight: 1}
            ]
        }]
    });
});

test('multiple records within and outside folders', async() => {
    const hotspotCSVData = [
        'module,revisions,code',
        'src/bob.js,25,123',
        'src/terry/one.js,25,12',
        'package.json,50,12' 
    ].join(EOL);

    await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({
        name: 'root',
        children: [{
                name: 'src',
                children: [
                    {size: 123, name: 'bob.js', weight: 0.25},
                    {
                        name: 'terry',
                        children: [
                            {size: 12, name: 'one.js', weight: 0.25}
                        ]
                    }
                ]
            },
            {size: 12, name: 'package.json', weight: 0.50}
        ]
    });
});

