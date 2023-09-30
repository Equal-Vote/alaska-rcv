import GameObject from "./GameObject";

class ImageObject extends GameObject{
    constructor(r, angle, size, url, backgroundSize='cover'){
        super('ImageObject', r, angle, size, undefined);
        this.url = `images/${url}`;
        this.backgroundSize = backgroundSize;
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            backgroundImage: `url(\"${this.url}\")`,
            backgroundSize: this.backgroundSize,
        }
    }
}

export default ImageObject;