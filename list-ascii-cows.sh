#!/bin/bash

for cowfile in cows/*.cow; do
  cowname=$(basename $cowfile)
  cowname="${cowname%.*}"

  imgname=""
  FILE=converter/src_images/${cowname}.png
  if test -f "$FILE"; then
    imgname="$FILE"
  else
    if [[ $cowname =~ ^.*-tc$ ]]; then
      shortname="${cowname%-tc*}"
      FILE=converter/src_images/${shortname}.png
      if test -f "$FILE"; then
        imgname="$FILE"
      fi
    fi
  fi
  if [ -z "$imgname" ]; then
      echo "\"$cowname\""
  fi
done
