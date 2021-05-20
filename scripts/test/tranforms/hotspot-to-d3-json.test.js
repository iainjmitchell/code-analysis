const EOL = require('os').EOL

const testCases = [
    { module: 'file1.js', revisions: 50, code: 1341 },
    { module: 'file2.js', revisions: 80, code: 9999 }
]

testCases.forEach((testCase) => {
    test('converted one record with 100% of weight', async() => {
        const hotspotCSVData = [
            'module,revisions,code',
            `${testCase.module},${testCase.revisions},${testCase.code}`
        ].join(EOL)
    
        await expect(HotspotToD3Json.transform(hotspotCSVData)).resolves.toEqual({"size": testCase.code, "name": testCase.module, "weight": 1})
    })
})

const parseString = require('@fast-csv/parse').parseString

const HotspotToD3Json = {
    transform: async(hotspotCSVData) => {
        return new Promise((resolve, reject) => {
            const rows = []
            parseString(hotspotCSVData, {headers: true})
                .on('data', row => {rows.push(row)})
                .on('end', () => { 
                    resolve({"size": parseInt(rows[0].code), "name": rows[0].module, "weight": 1})
                })
                .on('error', reject)
        })
    }
}