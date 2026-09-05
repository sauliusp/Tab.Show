#!/bin/zsh
set -euo pipefail
TASK_DIR="${0:A:h}"
/usr/local/bin/ffmpeg -y -hide_banner -loglevel error -i "$TASK_DIR/output/TabShow-Chrome-Web-Store-1080p60-silent.mp4" -i "$TASK_DIR/audio/tabshow-soundtrack-48s.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 384k -ar 48000 -ac 2 -t 48 -movflags +faststart -metadata title='TabShow: Preview Chrome Tabs Before You Switch' -metadata comment='TabShow product animation with original instrumental music.' "$TASK_DIR/output/TabShow-Chrome-Web-Store-1080p60.mp4"
/usr/local/bin/ffprobe -v error -show_format -show_streams -of json "$TASK_DIR/output/TabShow-Chrome-Web-Store-1080p60.mp4" > "$TASK_DIR/qa/final-media.json"
/usr/local/bin/ffmpeg -hide_banner -nostats -i "$TASK_DIR/output/TabShow-Chrome-Web-Store-1080p60.mp4" -vf 'blackdetect=d=0.05:pix_th=0.02:pic_th=0.98' -af 'ebur128=peak=true' -f null - 2> "$TASK_DIR/qa/final-decode-and-loudness.txt"
