#!/bin/bash

ANALYSIS_IGNORE_FILE=$1
ANALYSIS_FILE_LOG=$2

ignore_files=$(cat $ANALYSIS_IGNORE_FILE)

for ignore_file in $ignore_files
do
    if (uname -a | grep Darwin);
    then
        sed -i '' "/$ignore_file/d" $ANALYSIS_FILE_LOG
    else
        sed -i "/$ignore_file/d" $ANALYSIS_FILE_LOG
    fi
done

