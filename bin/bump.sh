#! /bin/bash

if [[ $# -gt 2 ]]; then
    echo "Usage: $0 BRANCH_NAME BRANCH_VERSION"
    exit 9
fi

PKG='package.json'
BRANCH=$1
VERSION=$2
VERSION=$(echo ${VERSION} | tr '[:upper:]' '[:lower:]')

bump_npm_version () {
  npm version ${1} -m "Upgrade to %s"
}


bump_version () {
  git pull origin ${1}
  git add ${PKG}
  git commit -m"Upgrade to ${2}"
}


if [[ $VERSION = 'major' ]]; then
    bump_npm_version 'major'

elif [[ $VERSION = 'minor' ]]; then
    bump_npm_version 'minor'

elif [[ $VERSION = 'patch' ]]; then
    bump_npm_version 'patch'

elif [[ $VERSION =~ ^[0-9]+.[0-9]+.[0-9]+$ ]]; then
    echo 'Major.Minor.Patch: ' $VERSION 
    sed -i '3s/:\s.*$/: "'${VERSION}'",/' ${PKG}
    bump_version $BRANCH

elif [[ $VERSION =~ ^[0-9]+.[0-9]+$ ]]; then
    echo 'Minor.Patch: ' $VERSION
    sed -i '3s/\([0-9]\+\)\..*$/\1.'${VERSION}'",/' ${PKG}
    bump_version $BRANCH

elif [[ $VERSION =~ ^[0-9]+$ ]]; then
    echo 'Patch: ' $VERSION 
    sed -i '3s/\([0-9]\+.[0-9]\+\)\..*$/\1.'${VERSION}'",/' ${PKG}
    bump_version $BRANCH
fi
