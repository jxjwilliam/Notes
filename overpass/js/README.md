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