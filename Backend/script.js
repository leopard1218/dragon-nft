const mergeImages = require('merge-images-v2');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');

const background = ['darkgreen', 'gray', 'green', 'green-white', 'green-yellow', 'purple', 'red', 'red-yellow', 'violet', 'yellow'];
const head = ['blue', 'gray-red-eye', 'green', 'green-red-eye', 'green-yellow-eye', 'orange', 'pink', 'red', 'violet', 'yellow'];
const horn = ['blue-horn', 'brown-horn', 'brown-horn-cap', 'cyan-cap', 'green-horn', 'orange-horn', 'pink-horn', 'purple-cap', 'purple-crown-cap', 'red-horn'];
const jeans = ['blue', 'brown', 'cyan', 'dark-green', 'gray', 'green-red', 'orange', 'pink', 'purple', 'red'];
const shirt = ['blue-mark', 'darkblue-mark', 'darkgray-mark', 'gray-mark', 'green-dot', 'orange-mark', 'pink-dot', 'pink-mark', 'red-mark', 'yellow-dot'];
const shoes = ['cyan', 'darkpurple', 'gray', 'green', 'green-red', 'pink', 'purple', 'red-gray', 'red-yellow', 'yellow'];
const tail = ['blue-pink', 'darkpurple', 'darkpurple-cyan', 'green-yellow', 'purple-green', 'purple-pink', 'purple-red', 'red-cyan', 'red-green', 'red-pink'];
// const character = [
//   ['red', 'pink', 'green', 'red', 'blue', 'green']
// ]
let repeatation = {}
const character = [];
let children = [];

const randomFunc = () => {
  return Math.trunc(Math.random() * 10 ** 7)
}
const generateCharacter = () => {
  let random = randomFunc()
  // return random;
  let repeatState = 0;
  // for(let j = 0; j < repeatation.length; j++) {
  //   if(repeatation[j] === random) {
  //     repeatState = 1;
  //   }
  // }
  if(repeatation[random.toString()] === 1) {
    console.log('repeatation')
    return generateCharacter()
  } else {    
    repeatation[random.toString()] = 1
    return random;
  }

}

const generateAll = () => {
  for (let i = 0; i < 1000; i++) {
    let value = generateCharacter().toString();
    // console.log(value)
    if(value.length < 7) {
      let zero = 7 - value.length;
      for(let k = 0; k < zero; k++) {
        value = 0 + value;
      }
    }
    children = []
    children.push(background[value.slice(0, 1)])
    children.push(tail[value.slice(1, 2)])
    children.push(head[value.slice(2, 3)])
    children.push(horn[value.slice(3, 4)])
    children.push(jeans[value.slice(4, 5)])
    children.push(shirt[value.slice(5, 6)])
    children.push(shoes[value.slice(6, 7)])
    // children.push(tail[value.slice(0, 1)])
    // children.push(head[value.slice(1, 2)])
    // children.push(horn[value.slice(2, 3)])
    // children.push(jeans[value.slice(3, 4)])
    // children.push(shirt[value.slice(4, 5)])
    // children.push(shoes[value.slice(5, 6)])
    character.push(children)
  }
  
}

generateAll()
// console.log(character)
const prefix = path.resolve('public/');
let i;
character.forEach((n, idx) => {
  i = 0;
  let imgs = n.map(attr => {    
    i += 1; 
    if(i == 1) return prefix + "/background/" + attr + '.PNG'
    else if(i == 2) return prefix + "/tail/" + attr + '.PNG'
    else if(i == 3) return prefix + "/head/" + attr + '.PNG'
    else if(i == 4) return prefix + "/horn/" + attr + '.PNG'
    else if(i == 5) return prefix + "/jeans/" + attr + '.PNG'
    else if(i == 6) return prefix + "/shirt/" + attr + '.PNG'
    else if(i == 7) return prefix + "/shoes/" + attr + '.PNG' 
    // if(i == 1) return prefix + "/tail/" + attr + '.PNG'
    // else if(i == 2) return prefix + "/head/" + attr + '.PNG'
    // else if(i == 3) return prefix + "/horn/" + attr + '.PNG'
    // else if(i == 4) return prefix + "/jeans/" + attr + '.PNG'
    // else if(i == 5) return prefix + "/shirt/" + attr + '.PNG'
    // else if(i == 6) return prefix + "/shoes/" + attr + '.PNG'
      
  });
  let imagePath = path.resolve('image') + `/${idx + 1 + 9000}.png`;
  let metadataPath = path.resolve('metadata') + `/${idx + 1 + 9000}.json`;
  const metadata = {
    description: "Dragon is a collection of Crypto Dragon.",
    name: "Betting dragon #" + (idx + 1 + 9000),
    attributes: {
      background: character[idx][0],
      head: character[idx][2],
      horncap: character[idx][3],
      jeans: character[idx][4],
      shirt: character[idx][5],
      shoes: character[idx][6],
      tail: character[idx][1]    
      // head: character[idx][1],
      // horncap: character[idx][2],
      // jeans: character[idx][3],
      // shirt: character[idx][4],
      // shoes: character[idx][5],
      // tail: character[idx][0]
    },
    image: `https://gateway.pinata/${idx + 1 + 9000}.png`
  }
  // console.log(imgs)
  fs.writeFileSync(metadataPath, JSON.stringify(metadata))
  mergeImages(imgs, {
    Canvas: Canvas
  }).then(img => {
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    const buf = new Buffer.from(base64Data, 'base64').toString('binary');
    fs.writeFileSync(imagePath, buf, 'binary');
  });
})