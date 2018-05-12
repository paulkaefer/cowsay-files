#!/bin/bash

# ANSI art (eg colored cows) don't render in txt or markdown. oh well.


for cowfile in cows/*cow; do
  cowname=$(basename $cowfile)
  echo "## ${cowname}"
  echo ""
  echo '```'

  cowsay -f ${cowfile} -- "$cowname"

  echo '```'
  echo ""
done

