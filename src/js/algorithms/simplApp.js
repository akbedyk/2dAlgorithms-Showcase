// app.js

const { gaussianFilter } = require('./simpl_Gauss');
const { createCanvas } = require('canvas')
const fs = require('fs')

const DEFAULT_CANVAS_WIDTH = 1000
const DEFAULT_CANVAS_HIGHT = 1000
const simplificationLevel = 50 // Level of simplification as a percentage

const canvas = createCanvas(DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HIGHT)
const ctx = canvas.getContext('2d')

ctx.fillStyle = 'gray'
ctx.fillRect(0, 0, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HIGHT)

// Example of a path:
const path = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1
}));

const sigma = 2; // Gauss sigma
const smoothedPath = gaussianFilter(path, sigma);



// ”прощаем кривую с использованием алгоритма ¬исвалдинга
//const simplifiedPath = visvalingamSimplification(smoothedPath, simplificationLevel);

//console.log('»сходные точки:', JSON.stringify(path, null, 2));
//console.log('—глаженные точки:', JSON.stringify(smoothedPath, null, 2));
//console.log('”прощЄнные точки:', JSON.stringify(simplifiedPath, null, 2));


const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))