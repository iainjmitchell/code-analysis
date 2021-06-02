const { execSync } = require("child_process");
const { EOL } = require('os');
const { writeFileSync } = require('fs');
const WORKING_DIR = `${__dirname}/temp-soc`;


beforeEach(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
    execSync(`mkdir ${WORKING_DIR}`);
});

const socFileName = `${WORKING_DIR}/soc.csv`;
const clocFileName = `${WORKING_DIR}/cloc_output.csv`;
const expectedCombinedFileName = `${WORKING_DIR}/expected.csv`;
const combinedFile = `${WORKING_DIR}/actual.csv`;

test('Multiple matching files in both soc and cloc', () => {
    const socFile = [
        'entity,soc',
        'bob.txt,12',
        'dave.txt,100'
    ].join(EOL);
    writeFileSync(socFileName, socFile);
    
    const clocFile = [
        'language,filename,blank,comment,code',
        'TXT,bob.txt,1,2,100',
        'TXT,dave.txt,1,2,1000'
    ].join(EOL);
    writeFileSync(clocFileName, clocFile);    
    
    const expectedCombinedFile = [
        'filename,lines,soc',
        'bob.txt,100,12',
        'dave.txt,1000,100'
    ].join(EOL);
    writeFileSync(expectedCombinedFileName, expectedCombinedFile);  

    execSync(`${__dirname}/../combine-soc-with-cloc --socfile ${socFileName} --clocfile ${clocFileName} --output ${combinedFile}`)
    expect(() => execSync(`diff -b ${combinedFile} ${expectedCombinedFileName}`))
        .not.toThrow();
});

test('soc contains items that are not in cloc log', () => {
    const socFile = [
        'entity,soc',
        'bob.txt,12',
        'dave.txt,100'
    ].join(EOL);
    writeFileSync(socFileName, socFile);
    
    const clocFile = [
        'language,filename,blank,comment,code',
        'TXT,bob.txt,1,2,100'
    ].join(EOL);
    writeFileSync(clocFileName, clocFile);    
    
    const expectedCombinedFile = [
        'filename,lines,soc',
        'bob.txt,100,12'
    ].join(EOL);
    writeFileSync(expectedCombinedFileName, expectedCombinedFile);  

    execSync(`${__dirname}/../combine-soc-with-cloc --socfile ${socFileName} --clocfile ${clocFileName} --output ${combinedFile}`)
    expect(() => execSync(`diff -b ${combinedFile} ${expectedCombinedFileName}`))
        .not.toThrow();
});

afterEach(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
});