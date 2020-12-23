#!/bin/bash

cd $(dirname $0)
if [ "$1" == "compile" ]; then
    echo "Compiling"
    for file in ./*.go; do
        outFile="compiled/$(basename $file | awk -F '.' '{ print $1 }').wasm"
        GOOS=js GOARCH=wasm go build -o $outFile $file
    done
else
    echo "Running in docker"
    DOCKER_NAME="golang"
    DOCKER_TAG="1.15-alpine"
    DOCKER_IMG="$DOCKER_NAME:$DOCKER_TAG"

    docker run --rm \
        -v $(pwd):/tmp/compileTests \
        -w /tmp/compileTests \
        $DOCKER_IMG \
        sh compile.sh compile
fi