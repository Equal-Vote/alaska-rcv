import GameObject from "./GameObject";

class ImageObject extends GameObject{
    constructor(r, angle, url){
        super(r, angle, 70, undefined);
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