#!/bin/bash
# Generates all AI imagery for the AvatarForge site (fictional people only).
set -u
cd /home/z/my-project
LOG=scripts/image-gen.log
echo "=== image generation started $(date) ===" >> "$LOG"
mkdir -p public/images/avatars

gen() { # out prompt size
  if [ -f "$1" ]; then echo "skip $1" >> "$LOG"; return; fi
  z-ai image -p "$2" -o "$1" -s "$3" >> "$LOG" 2>&1 && echo "done $1" >> "$LOG" || echo "FAIL $1" >> "$LOG"
}

gen public/images/avatars/realistic.png "Photorealistic studio portrait avatar of a fictional young woman, warm natural smile, soft diffused studio lighting, seamless light gray backdrop, head and shoulders composition, sharp focus, professional photography, high quality, detailed" 1024x1024
gen public/images/avatars/professional.png "Professional corporate headshot of a fictional man in his early 30s wearing a navy blazer and white shirt, confident friendly expression, clean neutral studio background, professional lighting, business profile photo style, high quality, detailed" 1024x1024
gen public/images/avatars/business.png "Corporate portrait of a fictional businesswoman in a dark suit, modern glass office interior softly blurred in the background, natural window lighting, professional business photography, high quality, detailed" 1024x1024
gen public/images/avatars/anime.png "Anime style avatar portrait of a fictional character, large expressive teal eyes, stylish colorful hair, clean cel shading, vibrant colors, modern anime illustration, head and shoulders, high quality, detailed" 1024x1024
gen public/images/avatars/cartoon.png "Cartoon avatar illustration of a friendly fictional man with exaggerated friendly features, bold clean outlines, flat vibrant colors, modern vector cartoon style, simple pastel background, high quality, detailed" 1024x1024
gen public/images/avatars/gaming.png "Esports gaming avatar of a fictional gamer wearing a gaming headset, dramatic neon purple and pink rim lighting, dark moody background with subtle hexagon patterns, cyberpunk digital art style, high quality, detailed" 1024x1024
gen public/images/avatars/three-d.png "Stylized 3D character avatar render of a fictional person, big friendly eyes, smooth soft shading, pleasant global illumination, pastel gradient background, premium 3D render, high quality, detailed" 1024x1024
gen public/images/avatars/social.png "Vibrant social media influencer avatar of a fictional young woman, cheerful expression, colorful violet and pink gradient background with sparkles and confetti, bright modern illustration style, high quality, detailed" 1024x1024
gen public/images/avatars/fantasy.png "Fantasy character avatar of a fictional elven ranger with ornate leather armor, glowing magical forest background, epic fantasy digital painting, dramatic lighting, high quality, detailed" 1024x1024
gen public/images/avatars/face.png "Photorealistic portrait of a completely fictional person who does not exist, symmetrical features, neutral friendly expression, studio lighting, plain gray background, professional photography, high quality, detailed" 1024x1024
gen public/images/og-image.png "Modern SaaS website hero background for an AI avatar generator platform, smooth violet to fuchsia gradient, abstract floating circular avatar silhouettes, sparkles and soft glow, clean minimal premium design, no text, no letters" 1440x720
gen public/images/icon-src.png "Minimal flat app icon for an AI avatar generator, a glowing white four-pointed sparkle star symbol centered on a rounded violet to magenta gradient square background, simple geometric, no text" 1024x1024

echo "=== image generation finished $(date) ===" >> "$LOG"
