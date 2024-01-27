import GameObject from "./GameObject";

class VideoEmbed extends GameObject{
    constructor(size, url, r=0, angle=0){
        super('VideoEmbed', r, angle, size, undefined);
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
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
            </iframe>
        </div>;
    }
}

export default VideoEmbed;