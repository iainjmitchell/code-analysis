#!/bin/bash

if (uname -a | grep Darwin);
then
    sed -i '' '/dave.json/d' $2
else
    sed -i '/dave.json/d' $2
fi