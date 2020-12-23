#!/bin/bash

cd $(dirname $0)
if [ "$1" == "compile" ]; then
    for file in ./*.go; do
        echo "Compiling $file"
        outFile="compiled/$(basename $file | awk -F '.' '{ print $1 }').wasm"
        GOOS=js GOARCH=wasm go build -o $outFile $file
    done
else
    echo "Starting docker container"
    DOCKER_NAME="golang"
    DOCKER_TAG="1.15-alpine"
    DOCKER_IMG="$DOCKER_NAME:$DOCKER_TAG"

    docker run --rm \
        -v $(pwd):/tmp/compileTests \
        -w /tmp/compileTests \
        $DOCKER_IMG \
        sh compile.sh compile
fi