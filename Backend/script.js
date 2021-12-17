const mergeImages = require('merge-images-v2');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');

const head = [green, red, blue, pink, purple, grey];
const horn = [green, red, blue, pink, purple, grey];
const jeans = [green, red, blue, pink, purple, grey];
const shirt = [green, red, blue, pink, purple, grey];
const shoes = [green, red, blue, pink, purple, grey];
const tail = [green, red, blue, pink, purple, grey];
// const character = [
//   ['red', 'pink', 'green', 'red', 'blue', 'green']
// ]
let repeatation = []
const character = [];
const children = [];
const generateCharacter = () => {
  return Math.trunc(Math.random() * 10 ** 6)
}

const generateAll = () => {
  for (let i = 0; i < 10000; i++) {
    let value = generateCharacter().toString();
    
    children.push(tail[value.slice(0, 1)])
    children.push(head[value.slice(1, 2)])
    children.push(horn[value.slice(2, 3)])
    children.push(jeans[value.slice(3, 4)])
    children.push(shirt[value.slice(4, 5)])
    children.push(shoes[value.slice(5, 6)])

    character.push(children)
  }
  console.log(character)
}
const prefix = path.resolve('public/');
let i;
character.forEach((n, idx) => {
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