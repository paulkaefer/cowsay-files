#!/bin/bash
#
# Lists all the cows that are defined with ASCII art, as opposed to
# being generated from image files by the converter/ stuff.
#
# Only works if you run it from within the repo.

for cowfile in cows/*.cow cows/true-color/*.cow; do
  cowname=$(basename $cowfile)
  cowname="${cowname%.*}"

  imgname=""
  FILE=converter/src_images/${cowname}.png
  if [[ -f "$FILE" ]]; then
    imgname="$FILE"
  fi
  FILE=converter/src_images/${cowname}-tc.png
  if [[ -f "$FILE" ]]; then
    imgname="$FILE"
  fi
  if [[ -z "$imgname" ]]; then
      echo "\"$cowname\""
  fi
done
