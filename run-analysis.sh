#!/bin/bash
CODE_DIR='code'

function start() {
    repository=$1
    codebase=$2
    codebaseFolder='analysis-'$codebase
    clean
    get_code
    create_analysis_site
    analyse_code 
    start_server
}

function get_code() {
    git clone $repository $CODE_DIR
}

function clean() {
    rm -rf $CODE_DIR
    rm -rf *_analysis
}

function create_analysis_site() {
    cp -r site-template $codebaseFolder
}

function analyse_code() {
    echo 'starting analysis'
    churn_analysis
}

function churn_analysis() {
    git_log='churn_log.log'
    cd code && git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames > $git_log  && cd ..
    docker container run -v $(pwd)/code:/code --rm philipssoftware/code-maat -l /code/$git_log -c git2 -a abs-churn > $codebaseFolder/data/churn.csv
}

function start_server(){
    http-server -p 8090 $codebaseFolder
}

start $1 $2


