import Canvas2Image from "canvas2image"


let getImg = function (viewer) {
    var canvas = viewer.scene.canvas;
    var imageWidth = 800;
    var img = Canvas2Image.convertToImage(canvas, imageWidth, imageWidth * canvas.height / canvas.width, 'png');
    return img
}

let getImgUrl = function (viewer){
    var img = getImg(viewer)
    return img.src;
}

let printMap = function (viewer){
    var loadImg = document.createElement('a')
    loadImg.href = getImgUrl(viewer)
    loadImg.download = 'earth'
    loadImg.click()
}
export default{
    getImg,
    getImgUrl,
    printMap,
};
