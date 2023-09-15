import GameObject from "./GameObject";

class ImageObject extends GameObject{
    constructor(r, angle, size, url){
        super(r, angle, size, undefined);
        this.url = url;
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            backgroundImage: `url(\"${this.url}\")`,
        }
    }
}

export default ImageObject;