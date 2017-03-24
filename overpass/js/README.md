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


## bash

- http://tuxtweaks.com/2014/05/bash-getopts/
- http://www.zytrax.com/tech/web/regex.htm



# ignore comment line.
REGEX="^#"
for dir in $(cat $CONFIG)
do 
        if [[ ! ${dir} =~ $REGEX ]]; then
                echo "process $dir..."
git checkout master
                cd ${dir}
        fi
done



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

git checkout development -- src/environment/dashboard/campaign/monitor/agents/agents.js


6. Ignore Changes in a Tracked File
If you are working in a team and all of them are working on same branch, probably you use `fetch/merge` quite often. this sometimes resets your environment specific config files which you have to change every time after merge. Using this command, you can ask git to ignore the changes to specific file. So next time you do merge, this file won’t be changed on your system.

git update-index --assume-unchanged src/params.rc.dist


7. Check if committed changes are part of a release
The `name-rev` command can tell you the position of a committ with respect to a last release. Using this you can check if your changes were part of the release or not.

git name-rev --name-only COMMIT_HASH_HERE  


8. Pull with rebase instead of merge

If you are working in a team which is working on same branch, then you have to do `fetch/merge` or pull quite often. Branch merges in git are recorded with merge commit to indicate when a feature branch was merged with mainstream. But in the scenario of multiple team members working on same branch, the regular merge causes multiple merge messages in the log causing confusion. So you can use rebase with pull to keep the history clear of useless merge messages.

git pull --rebase  


9. 
git checkout --theirs development src/.../monitor.js 


10. track a file

git log --follow -p -- package.json
git log --follow --all -p package.json



gitk
git reflog
