import GameObject from "./GameObject";

class Video extends GameObject{
    constructor(size, fileName, startTime=0, r=0, angle=0){
        super('Video', r, angle, size, undefined);
        this.size.y = this.size.x/1.77;
        this.video = require(`../assets/${fileName}`);
        this.videoId = fileName.split('\.')[0];
        this.blocked = false;
        this.startTime = startTime;
        this.windowFocused = true;

        document.addEventListener("visibilitychange", (event) => {
            if (document.visibilityState == "visible") {
                this.windowFocused = true;
            } else {
                this.windowFocused = false;
                this.pause();
            }
        });
    }

    isFocused(){
        return true;
    }

    play(){
        let vid = document.getElementById(`video_${this.videoId}`)
        if(this.blocked) return;
        if(!this.windowFocused) return;
        var isPlaying = vid.currentTime > 0 && !vid.paused && !vid.ended 
    && vid.readyState > vid.HAVE_CURRENT_DATA; // https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
        if(isPlaying) return;
        this.blocked = true;
        let p = vid.play();
        if(p == undefined){
            this.blocked = false;
        }else{
            p.then(() => {
                this.blocked = false;
            })
        }
    }

    pause(){
        let vid = document.getElementById(`video_${this.videoId}`)
        if(this.blocked) return;
        if(vid.paused) return;
        this.blocked = true;
        let p = vid.pause();
        if(p == undefined){
            this.blocked = false;
        }else{
            p.then(() => {
                this.blocked = false;
            })
        }
    }

    update(simState){
        let vid = document.getElementById(`video_${this.videoId}`);

        let start = Math.max(this.startTime, simState.videoStartTime);
        let stop = simState.videoStopTime;
        if(this.isVisible(simState)){
            if(vid.currentTime < start){
                vid.currentTime = start;
            }

            if(vid.ended){
                this.pause();
            }else if(vid.currentTime > stop){
                this.pause();
                vid.currentTime = stop;
            }else if(vid.currentTime < stop){
                this.play();
            }
        }else{
            vid.currentTime = start;
            this.pause();
        }
    }

    asComponent(simState, containerSize){
        return <div className={this.getClassNames(simState)} style={{
            ...this.getStyle(containerSize),
            height: '100%',
            background: 'black',
            transform: 'scale(1.1)',
        }} >
            <video id={`video_${this.videoId}`} width='100%' height='100%' muted preload="true">
                <source src={this.video} type='video/mp4' />
                <source src={this.video.replace('.mkv', '.ogg').replace('.mp4', '.ogg')} type='video/ogg' />
                <h1 style={{color: 'white'}}>Couldn't load video</h1>
            </video>
        </div>;
    }
}

export default Video;