#!/bin/bash
# Round 8: extra gallery examples for thin categories (fictional people only).
set -u
cd /home/z/my-project
LOG=scripts/image-gen.log
echo "=== round8 gallery generation started $(date) ===" >> "$LOG"

gen() { # out prompt size
  if [ -f "$1" ]; then echo "skip $1" >> "$LOG"; return; fi
  z-ai image -p "$2" -o "$1" -s "$3" >> "$LOG" 2>&1 && echo "done $1" >> "$LOG" || echo "FAIL $1" >> "$LOG"
}

gen public/images/avatars/realistic-3.png "Photorealistic studio portrait avatar of a fictional middle-aged man with a short beard, gentle confident smile, soft golden hour lighting, warm neutral backdrop, head and shoulders composition, sharp focus, professional photography, high quality, detailed" 1024x1024
gen public/images/avatars/anime-3.png "Anime style avatar portrait of a fictional girl with silver-lavender twin tails and violet eyes, slight blush, cherry blossom petals floating around, clean cel shading, pastel palette, modern anime illustration, head and shoulders, high quality, detailed" 1024x1024
gen public/images/avatars/gaming-3.png "Esports gaming avatar of a fictional man with dyed green undercut hair and a gaming headset around his neck, intense focused expression, electric violet and magenta neon glow, dark arena background with bokeh lights, cyberpunk digital art style, high quality, detailed" 1024x1024
gen public/images/avatars/three-d-3.png "Stylized 3D character avatar render of a fictional woman with wavy auburn hair and freckles, warm cheerful smile, smooth soft shading, cinematic rim light, mint to violet gradient background, premium 3D render, high quality, detailed" 1024x1024
gen public/images/avatars/social-3.png "Vibrant social media avatar of a fictional man with curly dark hair and round sunglasses, confident playful grin, bold orange and magenta gradient background with abstract shapes, modern flat illustration style, high quality, detailed" 1024x1024
gen public/images/avatars/character-3.png "Fantasy character avatar of a fictional orc warrior woman with braided dark hair and glowing amber eyes, ornate silver-and-violet armor, misty mountain fortress background, epic fantasy digital painting, dramatic lighting, high quality, detailed" 1024x1024

echo "=== round8 gallery generation finished $(date) ===" >> "$LOG"
