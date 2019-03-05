#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
XTERM_PARAMS="-geometry 120x30"

echo "Starting CONTAINER-DB"
xterm $XTERM_PARAMS "-T" "CONTAINER: DATABASE" "$DIR/start-db.sh" &

sleep 1

echo "Starting CONTAINER-APP"
xterm $XTERM_PARAMS "-T" "CONTAINER: SERVER" "cd $DIR/../ && npm run " &
