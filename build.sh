#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir -p $DIR/build
npm install
bower update
gulp build
cd $DIR/dist
touch $DIR/build/frontend.zip
rm $DIR/build/frontend.zip
zip -r $DIR/build/frontend.zip *
cd $DIR
