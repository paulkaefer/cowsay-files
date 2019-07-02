#!/bin/bash

for cowfile in cows/*.cow; do
  cowname=$(basename $cowfile)
  echo ""
  echo "## ${cowname}"
  cowname="${cowname%.*}"

  imgname=""

  #check if image file matching this cow name exists
  FILE=converter/src_images/${cowname}.png
  if test -f "$FILE"; then
    imgname="$FILE"
  else  # if image doesn't exist, check if it's a true color cow and try to find a matching image file
    if [[ $cowname =~ ^.*-tc$ ]]; then
      shortname="${cowname%-tc*}" #strip off the '-tc' from the file name and check for matching png
      FILE=converter/src_images/${shortname}.png
      if test -f "$FILE"; then
        imgname="$FILE"
      fi
    fi
  fi
  if [ -z "$imgname" ]; then  #if cow doesn't have a png image related, then just print the cow normally
      echo '```'
      cowsay -f ${cowfile} "$cowname"
      echo '```'
  else # otherwise insert an image tag for the source image
    echo "<img src=\"$imgname\" height=\"200\" />"
  fi
  echo ""
done
