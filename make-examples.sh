#!/bin/bash

for cowfile in ./cows/*.cow; do
  cowname=$(basename $cowfile)
  echo ""
  echo "## ${cowname}"
  cowname="${cowname%.*}"

  imgname=""

  #check if image file matching this cow name exists
  FILE=converter/src_images/${cowname}.png
  if test -f "$FILE"; then
    imgname="$FILE"
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


# Show true color cows separately
echo ""
echo "# True Color cows"
for cowfile in ./cows/true-color/*.cow; do
  cowname=$(basename $cowfile)
  echo ""
  echo "## ${cowname}"
  cowname="${cowname%.*}"

  imgname=""

  #check if image file matching this cow name exists
  FILE="converter/src_images/${cowname}-tc.png"
  if test -f "$FILE"; then
    imgname="$FILE"
  else  # if image doesn't exist, check if one without the -tc suffix exists
    FILE="converter/src_images/${cowname}.png"
    if test -f "$FILE"; then
      imgname="$FILE"
    fi
  fi
  if [ -z "$imgname" ]; then  #if cow doesn't have a png image related, then just print the cow normally
      echo '```'
      echo "COW NOT FOUND"
      echo '```'
  else # otherwise insert an image tag for the source image
    echo "<img src=\"$imgname\" height=\"200\" />"
  fi
  echo ""
done
