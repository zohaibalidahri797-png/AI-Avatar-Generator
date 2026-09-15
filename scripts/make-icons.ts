import sharp from 'sharp';

async function run() {
  const src = 'public/images/icon-src.png';
  await sharp(src).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(src).resize(32, 32).png().toFile('public/favicon.png');
  await sharp(src).resize(180, 180).png().toFile('public/apple-icon.png');
  await sharp(src).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(src)
    .resize(512, 512, { fit: 'cover' })
    .flatten({ background: '#8b2fd6' })
    .png()
    .toFile('public/icon-512-maskable.png');
  console.log('icons generated');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
