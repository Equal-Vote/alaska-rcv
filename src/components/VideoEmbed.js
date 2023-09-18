import GameObject from "./GameObject";

class VideoEmbed extends GameObject{
    constructor(size, url){
        super(0, 0, size, undefined);
        this.size.y = this.size.x/1.77;
        this.url = url;
    }

    isFocused(){
        return true;
    }

    asComponent(simState, containerSize){
        return <div className={this.getClassNames(simState)} style={this.getStyle(containerSize)} >
            <iframe
            style={{width: '100%', height: '100%'}}
            src={this.url}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
            </iframe>
        </div>;
    }
}

export default VideoEmbed;