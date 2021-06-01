const { execSync } = require("child_process");
const fs = require('fs');
const { EOL } = require('os');
const WORKING_DIR = `${__dirname}/temp`;
const ANALYSIS_IGNORE_FILE = `${WORKING_DIR}/.analysisignore`;

beforeEach(() => {
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
        '1 23 dave.txt'
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogExpectedFile = `${WORKING_DIR}/gitlog.expected`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogExpectedFile, gitLog);
    execSync(`${__dirname}/../analysis-ignore ${ANALYSIS_IGNORE_FILE} ${gitLogFile}`)
    expect(() => execSync(`diff -b ${gitLogFile} ${gitLogExpectedFile}`))
        .not.toThrow();
});

test('Removes one matching entry from git log', () => {
    const gitLog = [
        '--bf28da6--2021-05-24--bob',
        '12 dave.json'
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogExpected = [
        '--bf28da6--2021-05-24--bob'
    ].join(EOL);
    const gitLogExpectedFile = `${WORKING_DIR}/gitlog.expected`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogExpectedFile, gitLogExpected);
    execSync(`${__dirname}/../analysis-ignore ${ANALYSIS_IGNORE_FILE} ${gitLogFile}`)
    expect(() => execSync(`diff -b ${gitLogFile} ${gitLogExpectedFile}`))
        .not.toThrow();
});

test('Removes multiple matching entry from git log', () => {
    const gitLog = [
        '--bf28da6--2021-05-24--bob',
        '17 10 dave.json',
        '29 99 bob.txt',
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogExpected = [
        '--bf28da6--2021-05-24--bob'
    ].join(EOL);
    const gitLogExpectedFile = `${WORKING_DIR}/gitlog.expected`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogExpectedFile, gitLogExpected);
    execSync(`${__dirname}/../analysis-ignore ${ANALYSIS_IGNORE_FILE} ${gitLogFile}`)
    expect(() => execSync(`diff -b ${gitLogFile} ${gitLogExpectedFile}`))
        .not.toThrow();
});

test('Does not remove file from commit message', () => {
    const gitLog = [
        '[d3ac32c] Olly 2021-05-13 add lib to gitignore, update dave.json',
        '1 0 dave.json'
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogExpected = [
        '[d3ac32c] Olly 2021-05-13 add lib to gitignore, update dave.json',
    ].join(EOL);
    const gitLogExpectedFile = `${WORKING_DIR}/gitlog.expected`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogExpectedFile, gitLogExpected);
    execSync(`${__dirname}/../analysis-ignore ${ANALYSIS_IGNORE_FILE} ${gitLogFile}`)
    expect(() => execSync(`diff -b ${gitLogFile} ${gitLogExpectedFile}`))
        .not.toThrow();
});

afterEach(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
});