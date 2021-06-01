#!/bin/bash

ANALYSIS_IGNORE_FILE=$1
GIT_LOG_FILE=$2

ignore_files=$(cat $ANALYSIS_IGNORE_FILE)

for ignore_file in $ignore_files
do
    if (uname -a | grep Darwin);
    then
        sed -i '' "/$ignore_file/d" $GIT_LOG_FILE
    else
        sed -i "/$ignore_file/d" $GIT_LOG_FILE
    fi
done

