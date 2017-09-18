#!/bin/bash
set -e

# javascript
$yarn typecheck
$yarn tslint
$yarn test
$yarn build

# todo: ios build steps


