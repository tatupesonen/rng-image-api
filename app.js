const express = require("express");
const app = express();
const port = 3000;
const fs = require('fs');
const sharp = require('sharp');

const imageFolder = './img/';
const scaledFolder = "./img/scaled/";

const init = () => {
    imgs = getImages(imageFolder);
    try {
        imgs.forEach(img => {
            sharp(imageFolder + img).resize({ width: 1200})
            .withMetadata()
            .toFile(scaledFolder + img)
            .then(info => {
                console.log(`Resized image ${img} to size ${formatBytes(info.size)}`);
            })
        })
    } catch (e) {
        console.log("There was an error resizing the image or saving it: ", e);
    }
    
    
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getImages = (path) => {
    let imgs = fs.readdirSync(path);
    console.log("All images in the folder: ");
    imgs.forEach(i => {
        console.log(i);
    })
    console.log('---------------------------------------------\n\n')
    return imgs;
}

app.get('/', (req, res) => {
    console.log(`Sent image to IP ${req.ip}`);
    res.sendFile(randomImage(), { root: __dirname });
});

const randomImage = () => {
    imgs = getImages(scaledFolder);
    return scaledFolder + imgs[Math.floor(Math.random() * imgs.length)];
}

const resizeImage = (imgPath, imageName) => {
    sharp(imgPath)
        .resize({ width: 1000 })
        .toFile(scaledFolder + imageName, (err, info) => {
            console.log(info);
        });
}

init();
app.listen(port, () => {
    console.log(`Image server API listening on port ${port}`);
});