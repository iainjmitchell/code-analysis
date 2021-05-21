#!/bin/bash
CODE_DIR='code'
GIT_LOG='git_log.log'
CLOC_LOG='cloc_output.csv'

function start() {
    repository=$1
    codebase=$2
    codebaseFolder='analysis-'$codebase
    clean
    get_code
    create_analysis_site
    generate_git_log
    count_lines_of_code
    analyse_code 
    start_server
}

function get_code() {
    git clone $repository $CODE_DIR
}

function clean() {
    rm -rf $CODE_DIR
    rm -rf analysis_*
}

function create_analysis_site() {
    cp -r site-template $codebaseFolder
}

function analyse_code() {
    echo 'starting analysis'
    churn_analysis
    hotspots_analysis
}

function churn_analysis() {
    echo 'churn analysis'
    docker container run -v $(pwd)/$CODE_DIR:/$CODE_DIR --rm philipssoftware/code-maat -l /$CODE_DIR/$GIT_LOG -c git2 -a abs-churn > $codebaseFolder/data/churn.csv
}

function hotspots_analysis() {
    echo 'hotspot analysis'
    revisions_file='revisions.csv'
    hotspot_git_log='hotspot-git.log'
    cd $CODE_DIR
    git log --pretty=format:'[%h] %an %ad %s' --date=short --numstat > $hotspot_git_log
    cd ..
    docker container run -v $(pwd)/$CODE_DIR:/$CODE_DIR --rm philipssoftware/code-maat -l /$CODE_DIR/$hotspot_git_log -c git -a revisions > ./$CODE_DIR/$revisions_file
    python ./scripts/merge_comp_freqs.py $CODE_DIR/$revisions_file $CODE_DIR/$CLOC_LOG | node ./scripts/transformHotspotsToD3.js > $codebaseFolder/data/hotspots.json
}

function generate_git_log(){
    cd $CODE_DIR 
    git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames > $GIT_LOG
    cd ..
}

function count_lines_of_code() {
    docker run --rm -v $(pwd)/$CODE_DIR:/$CODE_DIR aldanial/cloc /$CODE_DIR --by-file --csv --report-file=/$CODE_DIR/$CLOC_LOG
    remove_code_directory_from_path='s/\/code\///g'
    sed -i '' $remove_code_directory_from_path ./$CODE_DIR/$CLOC_LOG
}

function start_server(){
    http-server -p 8090 $codebaseFolder
}

start $1 $2


