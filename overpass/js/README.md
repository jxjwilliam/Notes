###

in /overpass/application/, create:

/bin
/etc
/var

```bash
cd /overpass/application
mkdir bin etc var
chmod 
```


in ~/.profile, add:

```bash
 export PATH=$PATH:/overpass/application/bin
```

## README.md

## /bin/

### release.sh


### bump.sh

The code works with the parameters:

- bump.sh branch-name major
- bump.sh branch-name minor
- bump.sh branch-name patch
- bump.sh branch-name 2
- bump.sh branch-name 1.6
- bump.sh branch-name 3.6.9
- bump.sh branch-name
this case is the same as 'patch'


## /etc


## /var


## git

1. what files are changed for this commit?
```bash
  git diff --name-only HEAD^
```
will show:
- src/layout/site-header/site-header.html
- src/layout/site-header/site-header.js
- src/layout/site-header/site-service.js
- src/services/state.service.js


2. what files are changed between 2 different commits?

```bash
  git diff --name-only OLD_COMMIT_ID NEW_COMMIT_ID
```

3. Check current Branch changes are part of Other branch

```bash
  git cherry -v development
```
will show all commits different btw current-branch and development-branch


4. start a new branch with no History

```bash
  git checkout --orphan NEW_BRANCH_NAME_HERE  
```


5. Checkout File from Other Branch without Switching Branches

git checkout BRANCH_NAME_HERE -- PATH_TO_FILE_IN_BRANCH_HERE