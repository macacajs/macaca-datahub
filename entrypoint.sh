#!/bin/bash

npm i -g macaca-datahub --registry=https://registry.npm.taobao.org

macaca-datahub -v

macaca-datahub server --verbose
