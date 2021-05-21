const parseString = require('@fast-csv/parse').parseString;

class D3Json {
    #object = {
        name: 'root',
        children: []
    };
    #totalNumberOfRevisions;

    constructor(totalNumberOfRevisions){
        this.#totalNumberOfRevisions = totalNumberOfRevisions;
    }

    addRow(csvDataRow){
        const convertedRow = CsvRowTransform.transform(csvDataRow, this.#totalNumberOfRevisions);
        const directories = csvDataRow.module.split('/');
        directories.pop(); //remove the filename
        const parent = this.#object;
        const directory = this.#ensureDirectoriesExists(directories, parent);
        directory.children.push(convertedRow);
    }

    render(){
        return this.#object;
    }

    #ensureDirectoriesExists(directories, parentDirectory) {
        const directoryName = directories.shift();
        if (!directoryName) return parentDirectory;
        const matchingDirectory = parentDirectory.children.find(directory => directory.name === directoryName);
        if (!matchingDirectory) {
            const newDirectory = {
                name: directoryName,
                children: []
            };
            parentDirectory.children.push(newDirectory);
            return this.#ensureDirectoriesExists(directories, newDirectory);
        }
        else {
            return this.#ensureDirectoriesExists(directories, matchingDirectory);
        }
    }
}

class CsvRowTransform {
    static transform(csvDataRow, totalNumberOfRevisions){
        const weight = WeightCalculator.calculate(csvDataRow.revisions, totalNumberOfRevisions);
        const name = csvDataRow.module.split('/').pop();
        return {name, weight, size: parseInt(csvDataRow.code)};
    }
}


class WeightCalculator {
    static calculate(revisions, totalRevisions) {
        return (parseInt(revisions) / totalRevisions);
    }
}

class HotspotToD3Json {
    static async transform(hotspotCSVData) {
        const csvData = await HotspotToD3Json._parseCSVData(hotspotCSVData);
        const totalNumberOfRevisions = HotspotToD3Json.sumNumberOfRevisions(csvData);
        const d3Json = new D3Json(totalNumberOfRevisions);
        csvData.forEach(cvsRecord => d3Json.addRow(cvsRecord));
        return d3Json.render();
    }

    static sumNumberOfRevisions(csvData){
        return csvData.reduce((sum, csvRow) => sum + parseInt(csvRow.revisions), 0);
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
}

module.exports = HotspotToD3Json;