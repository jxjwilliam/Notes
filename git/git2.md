
Summary and collection to make everyday `git` works easier.

## Advanced tips

### what files are changed for this commit?
```bash
  git diff --name-only HEAD^
```
will show:
- src/layout/site-header/site-header.html
- src/layout/site-header/site-header.js
- src/layout/site-header/site-service.js
- src/services/state.service.js


### what files are changed between 2 different commits?

```bash
  git diff --name-only OLD_COMMIT_ID NEW_COMMIT_ID
```

### Check current Branch changes are part of Other branch

```bash
  git cherry -v development
```
will show all commits different btw current-branch and development-branch


### start a new branch with no History

```bash
  git checkout --orphan NEW_BRANCH_NAME_HERE  
```


### Checkout File from Other Branch without Switching Branches

```bash
git checkout development -- src/environment/dashboard/campaign/monitor/agents/agents.js
```

### Ignore Changes in a Tracked File
If you are working in a team and all of them are working on same branch, probably you use `fetch/merge` quite often. this sometimes resets your environment specific config files which you have to change every time after merge. Using this command, you can ask git to ignore the changes to specific file. So next time you do merge, this file won’t be changed on your system.

git update-index --assume-unchanged src/params.rc.dist


### Check if committed changes are part of a release
The `name-rev` command can tell you the position of a committ with respect to a last release. Using this you can check if your changes were part of the release or not.

```bash
git name-rev --name-only COMMIT_HASH_HERE  
```

### Pull with rebase instead of merge

If you are working in a team which is working on same branch, then you have to do `fetch/merge` or pull quite often. Branch merges in git are recorded with merge commit to indicate when a feature branch was merged with mainstream. But in the scenario of multiple team members working on same branch, the regular merge causes multiple merge messages in the log causing confusion. So you can use rebase with pull to keep the history clear of useless merge messages.

```bash
git pull --rebase  
```

### checkout a specific file from a branch:

```bash
git checkout --theirs development src/.../monitor.js 
```

## Tools

- git reflog
- gitk
- git difftool

## Reference:

- https://github.com/git-tips/tips
- https://www.alexkras.com/19-git-tips-for-everyday-use/
