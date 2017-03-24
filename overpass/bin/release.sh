#! /bin/bash

SCRIPT=`basename ${BASH_SOURCE[0]}`

#Set fonts for Help.
NORM=`tput sgr0`
BOLD=`tput bold`
REV=`tput smso`

function HELP {
cat <<__HERE__

${REV}Basic usage:${NORM} ${BOLD}$SCRIPT [command-options]${NORM}

  ${SCRIPT} ${NORM}${BOLD} new BRANCH_NAME ${NORM}
  ${SCRIPT} ${NORM}${BOLD} reset [BRANCH_NAME]${NORM}  //if BRANCH_NAME absent, will reset master,development branches
  ${SCRIPT} ${NORM}${BOLD} fetch ${NORM}  
  ${SCRIPT} ${NORM}${BOLD} merge SOURCE_BRANCH  DEST_BRANCH${NORM}
  ${SCRIPT} ${NORM}${BOLD} bump [BRANCH_NAME] [major/minor/patch/version]${NORM}  //if params absent, will use master,development branches 
  ${SCRIPT} ${NORM}${BOLD} push [BRANCH_NAME]${NORM}   //if params absent, will push master, development branches. 
  ${SCRIPT} ${NORM}${BOLD} clear_logs [LOGFILE]${NORM} //if param absent, clear all logs in var/release/

__HERE__
  exit 1
}

if [ "$#" -eq 0 ]; then
  HELP
fi


DIR=../bin/
NEW=${DIR}new.sh
RESET=${DIR}reset.sh
FETCH=${DIR}fetch.sh
MERGE=${DIR}merge.sh
BUMP=${DIR}bump.sh
PUSH=${DIR}push.sh
CLEAR=${DIR}clear_logs.sh


CONFIG=../etc/release.conf
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
	if [ $line =~ "["${SECT1}"]" ]; then
		SECTION=${SECT1}
	elif [ $line =~ "["${SECT2}"]" ]; then
		SECTION=${SECT2}
	else
		if [ ! $line =~ [^[:space:] ]; then
			continue;
		elif [ ! ${line} =~ $REGEX ]; then
			if [ ${SECTION} =~ ${SECT1} ]; then
				case ${SECTION1} in
					'') SECTION1=$line;;
					 *) SECTION1+=${DELIMITER}${line};;
				esac
			elif [ ${SECTION} =~ ${SECT2} ]; then
				case ${SECTION2} in
					'') SECTION2=$line;;
					 *) SECTION2+=${DELIMITER}${line};;
				esac
			fi
		fi
	fi
done <${CONFIG}



do_2_loop() {
}

do_1_loop() {
}


### MAIN ###

if [ $1 = 'new' ]; then
  if [ $2 = '' ]; then
    HELP
  fi
  for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
    cd ${s1}
    echo -e "[$s1]: creating new branch [" ${2} "]..."
    source ${NEW} ${2}
  done
  echo -e "Done: [${2}] is created in [$s1]."


elif [ $1 = 'reset' ]; then
  if [ $2 = '' ]; then
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
	cd ${s1}
	for s2 in $(echo ${SECTION2} | tr $DELIMITER "\n" ); do
          echo -e "[$s1]: reset branch [" ${s2} "]..."
	  source ${RESET} ${s2}
          echo -e \\n"Done: [${s2}] is reset in [$s1]."
	done
    done
  else
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
      cd ${s1}
      echo -e "[$s1]: reset branch [" ${2} "]..."
      source ${RESET} ${2}
      echo -e \\n"Done: [${2}] is reset in [$s1]."
    done
  fi

elif [ $1 = 'fetch' ]; then
  for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
    cd ${s1}
    echo -e "[$s1]: fetch..."
    source ${FETCH}
  done
  echo -e \\n"Done."

elif [ $1 = 'merge' ]; then
  if [ "$#" -ne 3 ]; then
    echo "merge SOURCE_BRANCH  DEST_BRANCH"
    HELP
  fi

  for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
    cd ${s1}
    echo -e "merge: " ${2} ${3}
    source ${MERGE} ${2} ${3}
  done

  echo -e \\n"Done: merge [${2}] into [${3}]."

elif [ $1 = 'bump' ]; then
  if [ "$#" -gt 3 ]; then
    echo \n\n"bump [BRANCH_NAME] [major/minor/patch/version]"
    HELP
  fi
  
  if [ $2 = '' ]; then
    VERSION=patch3

    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
      cd ${s1}
      echo -e "In folder [$s1],"
      for s2 in $(echo ${SECTION2} | tr $DELIMITER "\n" ); do
	echo -e "Process branch [$s2]... "
	source ${BUMP} ${s2} ${VERSION}
      done
    done

  else
    # $2 is the branch-name
    if [ $3 = '' ]; then
      VERSION=patch
    else
      VERSION=$3
    fi
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
      cd ${s1}
      echo -e "In folder [$s1],"
      source ${BUMP} ${2} 
    done
  fi

  echo "Done. bump"

elif [ $1 = 'push' ]; then
  if [ $2 = '' ]; then
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
      cd ${s1}
      echo -e "In folder [$s1],"
      for s2 in $(echo ${SECTION2} | tr $DELIMITER "\n" ); do
	echo -e "Process branch [$s2]... "
	source ${PUSH} ${s2}
      done
    done
  else
    for s1 in $(echo ${SECTION1} | tr $DELIMITER "\n" ); do
      cd ${s1}
      echo -e "In folder [$s1],"
      source ${PUSH} ${2} 
    done
  fi

  echo -e "Done: push."


elif [ $1 = 'clear_logs' ]; then
  if [ $2 = '' ]; then
    echo -e \\n"clear_logs all logs"
    source ${CLEAR}
  else
    echo -e \\n"clear_logs ${2}"
    source ${CLEAR} ${2}
  fi
  echo -e \\n"Done: clear logs in var/release."

else
  HELP
fi



