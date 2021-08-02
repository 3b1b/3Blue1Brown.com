#!/bin/bash
# Loops through and compress all video files ending with *.source.mp4 or *.source.mov. For 
# example, the file  .../example.source.mp4 becomes .../example.mp4 (compressed)
#
# Date: 2021 07 22
# Author: kurtbruns

# Check to make sure ffmpeg is installed
command -v ffmpeg >/dev/null 2>&1 || { echo >&2 "ffmpeg is required to run this script."; exit 1; }

# loop through and compress the video files
for fullfile in $(find ./public/content -name '*.source.mp4' -or -name '*.source.mov'); do

  # isolate parts of the file path
  dir=$(dirname -- "$fullfile")
  file=$(basename -- "$fullfile")
  extension="${file##*.}"
  name="${file%.*}"
  compressed="${name%.*}"

  # compress video file, remove audio, set quality to 1080p, overwrite existing files
  ffmpeg -i $fullfile -an -s hd1080 -hide_banner -loglevel error -y ${dir}/${compressed}.mp4

  # display source and destination sizes
  src=$(du -m -h $fullfile)
  dst=$(du -m -h ${dir}/${compressed}.mp4)
  echo $src '->' $dst

done
