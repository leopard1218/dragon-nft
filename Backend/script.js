const mergeImages = require('merge-images-v2');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');

const number = [
  ['red', 'blue', 'green', 'red', 'blue', 'green']
]
const prefix = path.resolve('public/');
let i;
number.forEach((n, idx) => {
  i = 0;
  let imgs = n.map(attr => {
    i += 1;
    if(i == 1) return prefix + "/tail/" + attr + '.PNG'
    else if(i == 2) return prefix + "/head/" + attr + '.PNG'
    else if(i == 3) return prefix + "/horn/" + attr + '.PNG'
    else if(i == 4) return prefix + "/jeans/" + attr + '.PNG'
    else if(i == 5) return prefix + "/shirt/" + attr + '.PNG'
    else if(i == 6) return prefix + "/shoes/" + attr + '.PNG'    
  });
  let imagePath = path.resolve('image') + `/${idx + 1}.png`;
  mergeImages(imgs, {
    Canvas: Canvas
  }).then(img => {
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    const buf = new Buffer.from(base64Data, 'base64').toString('binary');
    fs.writeFileSync(imagePath, buf, 'binary');
  });
})