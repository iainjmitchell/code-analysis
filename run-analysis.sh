#!/bin/bash
CODE_DIR='code'

function clean_code_area() {
    rm -r $CODE_DIR
}

function start() {
    repository=$1
    echo $repository
    clean_code_area
    get_code $repository
}

function get_code() {
    git clone $repository $CODE_DIR
}

start $1

