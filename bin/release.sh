#! /bin/bash

SCRIPT=`basename ${BASH_SOURCE[0]}`

# Set fonts for Help.
NORM=`tput sgr0`
BOLD=`tput bold`
REV=`tput smso`

function HELP {
cat <<__HERE__

${REV}Basic usage:${NORM} ${BOLD}$SCRIPT [command-options]${NORM}

  ${SCRIPT} ${NORM}${BOLD} new BRANCH_NAME ${NORM}
  ${SCRIPT} ${NORM}${BOLD} reset [BRANCH_NAME]${NORM}  ;if BRANCH_NAME absent, will reset master,development branches
  ${SCRIPT} ${NORM}${BOLD} fetch ${NORM}  
  ${SCRIPT} ${NORM}${BOLD} merge SOURCE_BRANCH  DEST_BRANCH${NORM}
  ${SCRIPT} ${NORM}${BOLD} bump [BRANCH_NAME] [major/minor/patch/version]${NORM}  ;if params absent, will use master,development branches 
  ${SCRIPT} ${NORM}${BOLD} push [BRANCH_NAME]${NORM}   ;if params absent, will push master, development branches. 
  ${SCRIPT} ${NORM}${BOLD} clear_logs [LOGFILE]${NORM} ;if param absent, clear all logs in var/release/

__HERE__
  exit 1
}

[ "$#" -eq 0 ] && HELP


DIR=../release.overpass.com/bin/
NEW=${DIR}new.sh
RESET=${DIR}reset.sh
FETCH=${DIR}fetch.sh
MERGE=${DIR}merge.sh
BUMP=${DIR}bump.sh
PUSH=${DIR}push.sh
CLEAR=${DIR}clear_logs.sh

if [ -f '../etc/release.local.conf' ]; then
  CONFIG=../etc/release.local.conf
else
  CONFIG=../etc/release.conf
fi

SECT1=REPOSITORY
SECT2=BRANCH
DELIMITER=';'

LOGDIR=../var/release/
NOW=$(date +"%F_%H-%M-%S")
LOGFILE=${LOGIR}"log-$NOW.log"

# ignore comment line and empty line.
REGEX="^#"

while read line
do
	if [[ $line =~ "["${SECT1}"]" ]]; then
		SECTION=${SECT1}
	elif [[ $line =~ "["${SECT2}"]" ]]; then
		SECTION=${SECT2}
	else
		if [[ ! $line =~ [^[:space:]] ]]; then
			continue;
		elif [[ ! ${line} =~ $REGEX ]]; then
			if [[ ${SECTION} =~ ${SECT1} ]]; then
				case ${SECTION1} in
					'') SECTION1=$line;;
					 *) SECTION1+=${DELIMITER}${line};;
				esac
			elif [[ ${SECTION} =~ ${SECT2} ]]; then
				case ${SECTION2} in
					'') SECTION2=$line;;
					 *) SECTION2+=${DELIMITER}${line};;
				esac
			fi
		fi
	fi
done <${CONFIG}

# Inputs:
# 1. script-name: ${NEW}
# 2. relative-param: ${BRANCH_NAME}
do_1_loop() {
  for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
    cd ${s1}
    source ${1} ${2} ${3}
  done
}


# Inputs: loop `master` and `development` branches.
# 1. script-name: ${RESET}
do_2_loop() {
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
	cd ${s1}
	  for s2 in $(echo ${SECTION2} | tr $DELIMITER "\n" ); do
        echo -e ${s2}, ${s1} $*
	    source $1 ${s2}
        #echo -e "Done: [${s2}] is reset in [$s1]."
	  done
    done
}


### MAIN ###

if [ $1 = 'new' ]; then
  [ X"$2" = X'' ] && HELP;
  BRANCH_NAME=$2
  echo -e "Creating new branch [${BRANCH_NAME}]..."
  do_1_loop ${NEW} ${BRANCH_NAME}
  echo -e "Done. new branch [${BRANCH_NAME}] is created."


elif [ $1 = 'reset' ]; then
  case "$2" in
  '')
    echo -e "Reset branches [${SECTION2}]..."
    do_2_loop ${RESET}
    echo -e "Done. [${SECTION2}] are reset."
    ;;
  *)
    BRANCH_NAME=$2
    echo -e "Reset new branch [${BRANCH_NAME}]..."
    do_1_loop ${RESET} ${BRANCH_NAME}
    echo -e "Done. new branch [${BRANCH_NAME}] is reset."
    ;;
  esac

elif [ $1 = 'fetch' ]; then
  echo -e "Reset new branch [${BRANCH_NAME}]..."
  do_1_loop ${FETCH}

elif [ $1 = 'merge' ]; then
  [ "$#" -ne 3 ] && HELP

  SRC=${2}
  DEST=${3}
  echo -e "Merge [${SRC}] to [${DEST}]."
  do_1_loop ${MERGE} ${SRC} ${DEST}
  echo -e "Done. merged [${SRC}] to [${DESC}]."

elif [ $1 = 'bump' ]; then
  [ "$#" -gt 3 ] && HELP
  
  case "$2" in
  '')
    VERSION=patch
    do_2_loop ${BUMP} ${VERSION}
    # source ${BUMP} ${s2} ${VERSION}
    echo -e "Done. bump branch [${BRANCH}] and version [${BRANCH}]"
   ;;
  *)
    # $2 is the branch-name
    BRANCH=${2}
    if [ "$3" = '' ]; then
      VERSION=patch
    else
      VERSION=$3
    fi
    do_1_loop ${BUMP} ${BRANCH} ${BRANCH}
    echo "Done. bump branch [${BRANCH}] and version [${BRANCH}]"
    ;;
  esac

elif [ $1 = 'push' ]; then
  case "$2" in
  '')
    do_2_loop ${PUSH}
    #source ${PUSH} ${s2}
    ;;
  *)
    do_1_loop ${PUSH} ${2}
    ;;
  esac

elif [ $1 = 'clear_logs' ]; then
  if [ X"$2" = X'' ]; then
    echo -e "clear_logs all logs"
    source ${CLEAR}
  else
    echo -e "clear_logs ${2}"
    source ${CLEAR} ${2}
  fi
  echo -e "Done: clear logs in var/release."

else
  HELP
fi
