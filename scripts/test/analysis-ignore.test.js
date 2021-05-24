const { execSync } = require("child_process");
const fs = require('fs');
const { EOL } = require('os');
const WORKING_DIR = `${__dirname}/temp`;

beforeAll(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
    execSync(`mkdir ${WORKING_DIR}`);
});

test('Returns same Nothing matching in git log', () => {
    const analysisIgnore = [
        'bob.txt',
        'dave.json'
    ].join(EOL);
    const analysisIgnoreFile = `${WORKING_DIR}/.analysisignore`;
    fs.writeFileSync(analysisIgnoreFile, analysisIgnore);

    const gitLog = [
        '--bf28da6--2021-05-24--bob',
        'dave.txt'
    ].join(EOL);
    const gitLogFile = `${WORKING_DIR}/gitlog.log`
    const gitLogBefore = `${WORKING_DIR}/gitlog.before`
    fs.writeFileSync(gitLogFile, gitLog);
    fs.writeFileSync(gitLogBefore, gitLog);
    execSync(`${__dirname}/../analysis-ignore.sh ${analysisIgnoreFile} ${gitLogFile}`)
    expect(() => execSync(`diff ${gitLogBefore} ${gitLogFile}`))
        .not.toThrow();
});

afterAll(() => {
    execSync(`rm -rf ${WORKING_DIR}`);
});