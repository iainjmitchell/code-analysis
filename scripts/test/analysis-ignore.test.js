const { execSync } = require("child_process");
const fs = require('fs');
const { EOL } = require('os');
const WORKING_DIR = `${__dirname}/temp`;
const ANALYSIS_IGNORE_FILE = `${WORKING_DIR}/.analysisignore`;

beforeAll(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
    execSync(`mkdir ${WORKING_DIR}`);
    createAnalysisIgnoreFile();
});

function createAnalysisIgnoreFile(){
    const analysisIgnore = [
        'bob.txt',
        'dave.json'
    ].join(EOL);
    fs.writeFileSync(ANALYSIS_IGNORE_FILE, analysisIgnore);
}

test('Returns same when nothing matches in git log', () => {
    const gitLog = [
        '--bf28da6--2021-05-24--bob',
        'dave.txt'
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogExpected = `${WORKING_DIR}/gitlog.expected`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogExpected, gitLog);
    execSync(`${__dirname}/../analysis-ignore.sh ${ANALYSIS_IGNORE_FILE} ${gitLogFile}`)
    expect(() => execSync(`diff ${gitLogFile} ${gitLogExpected}`))
        .not.toThrow();
});

afterAll(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
});