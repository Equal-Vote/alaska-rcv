import GameObject from "./GameObject";

class Video extends GameObject{
    constructor(size, fileName, startTime=0, r=0, angle=0){
        super('Video', r, angle, size, undefined);
        this.size.y = this.size.x/1.77;
        this.video = require(`../assets/${fileName}`);
        this.startTime = startTime;
        this.videoId = fileName.split('\.')[0];
    }

    isFocused(){
        return true;
    }

    update(simState){
        let vid = document.getElementById(`video_${this.videoId}`);
        let shouldPlay = this.isVisible(simState) && vid.currentTime < simState.videoStopTime && !vid.ended;
        if(vid.paused && shouldPlay) vid.play();
        if(!vid.paused && !shouldPlay) vid.pause();

        if(this.isVisible && vid.currentTime > simState.videoStopTime) vid.currentTime = simState.videoStopTime;
        if(!this.isVisible(simState)) vid.currentTime = this.startTime;
    }

    asComponent(simState, containerSize){
        return <div className={this.getClassNames(simState)} style={this.getStyle(containerSize)} >
            <video id={`video_${this.videoId}`} width='100%' height='100%' muted>
                <source src={this.video} type='video/mp4' />
                Couldn't load video
            </video>
        </div>;
    }
}

export default Video;