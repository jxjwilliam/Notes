
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

### track a file

```bash
git log --follow -p -- package.json
git log --follow --all -p package.json


git log --follow -p -- package.json
git log --follow --all -p package.json
git log --pretty=short -u -L package.json
git log -p

git add -p [file_name]
git rebase -i HEAD~[number_of_commits]
gitk --follow --all -p package.json
git branch -vv
```

For `git branch -vv`:
-v, -vv, --verbose
  When in list mode, show sha1 and commit subject line for each head, along with
  relationship to upstream branch (if any). If given twice, print the name of the
  upstream branch, as well (see also git remote show <remote>).


### Who Messed With My Code?

It’s the natural instinct of human beings to blame others when something goes wrong. If your production server is broke, it’s very easy to find out the culprit — just do a git blame. This command shows you the author of every line in a file, the commit that saw the last change in that line, and the timestamp of the commit.

```bash
git blame [file_name]

git stash
git stash list
git stash apply
git stash pop
git stash clear

git diff --stat
git log --stat

```

Log actual changes in a file

```bash
git log -p filename
```

Extract a file from another branch

```bash
git show some-branch:some-file.js
```

### Ignore the white space

Sample git diff -w or git blame -w

Pick a commit from another branch
It’s sometimes useful to pick a commit from another branch to add it in the current branch.

git cherry-pick [commit_hash]


### Revisions

Most Git commands expect some kind of revision. Usually you pass in a branch name or a SHA1 of a specific commit, but Git revisions are much more powerful than that.

First, there is a special revision called head (also known as HEAD). head is whatever point your working directory currently is at, usually the tip of a branch.

Second, you can easily reach older commits given a starting ref without having to know their SHA1. Let’s say you want to specify the commit that came before the current one (also called “parent”): Simply type head^. The great-grandfather? head^^^. However, the farther back you go in history, the more cumbersome it gets. So Git also offers an alternate syntax for this: The great-grandfather can also be specified using head~3.

Want to reach the commit whose commit message matches a certain string? Use :/really awesome commit to find that really awesome commit.

branch@{yesterday} will give you the revision that branch was at yesterday, branch@{2 days 3 hours 4 seconds ago} is the branch, well, 2 days, 3 hours and 4 seconds ago.

I’ve only scratched the surface of what’s possible, so make sure you read the man page.


## Tools

- git reflog
- gitk
- git difftool

## Reference:

- https://github.com/git-tips/tips
- https://www.alexkras.com/19-git-tips-for-everyday-use/
