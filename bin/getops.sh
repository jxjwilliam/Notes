#! /bin/bash

SCRIPT=`basename ${BASH_SOURCE[0]}`

function HELP {
cat <<__HERE__
Help documentation for ${BOLD}${SCRIPT}.${NORM}
${REV}Basic usage:${NORM} ${BOLD}$SCRIPT file.ext${NORM}
  -c) command
    -c reset
    -c new
    -c push
  -b) branch
    -b master
    -b development
  -v) version
    -v 0.1.26
    -v 2.1.5
  -h) Help
  -?) Help
__HERE__
	exit 1
}

#Set fonts for Help.
NORM=`tput sgr0`
BOLD=`tput bold`
REV=`tput smso`

#Check the number of arguments. If none are passed, print help and exit.
#echo -e \\n"Number of arguments: $#"
if [[ $# -eq 0 ]]; then
  HELP
fi

### Start getopts code ###

while getopts :c:b:v:h FLAG; do
	case $FLAG in
	c) # -c: command
		OPT_C=${OPTARG}
		echo "-c command: $OPT_C"
		;;
	b) # -b: branch
		OPT_B=${OPTARG}
		echo "-b branch: $OPT_B"
		;;
	v)
		OPT_V=${OPTARG}
		echo "-v version: $OPT_V"
		;;
	h) # -h --help
		HELP
		;;
	\?) #unrecognized option - show help
		echo -e \\n"Option -${BOLD}$OPTARG${NORM} not allowed."
		HELP
		;;
	*) # without args, or unexpect args
		echo "without args, or unexpect args"
		HELP
		;;
	esac
done


shift $((OPTIND-1))  #This tells getopts to move on to the next argument.

### End getopts code ###
