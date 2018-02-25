#!/bin/bash

export SemVer=`gitversion /showvariable SemVer`
export MajorMinorPatch=`gitversion /showvariable MajorMinorPatch`
export Major=`gitversion /showvariable Major`
export Minor=`gitversion /showvariable Minor`
export Patch=`gitversion /showvariable Patch`
export PreReleaseNumber=`gitversion /showvariable PreReleaseNumber`

Candidate=99
if [[ ! -z $PreReleaseNumber ]]
then
  Candidate=$PreReleaseNumber
fi
export BuildNumber=$(($Major * 1000000 + $Minor * 10000 + $Patch * 100 + $Candidate))

sed -i '' -e 's/"version": ".*"/"version": "'$MajorMinorPatch'"/g' app.json
sed -i '' -e 's/"buildNumber": ".*"/"buildNumber": "'$BuildNumber'"/g' app.json
sed -i '' -e 's/"versionCode": [0-9]*/"versionCode": '$BuildNumber'/g' app.json
sed -i '' -e 's/"semver": ".*"/"semver": "'$SemVer'"/g' app.json
