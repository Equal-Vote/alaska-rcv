import GameObject from "./GameObject"

class VoterCamp extends GameObject{
    constructor(r, angle) {
        super(r, angle, 5, 10000000)
        this.members = [];
        this.size.x = this.size.y*2;
    }

    refreshMembers(){
        this.members = this.members.filter(o => o.camp == this);
    }

    //update(){
    //    let target = 5 + this.members.length / 10;
    //    let t = .1;
    //    this.size = this.size*(1-t) + target*t;
    //}

    asComponent(containerSize) {
        return <div className='object VoterCamp' style={this.getStyle(containerSize)}>
            {this.members.length > 0 &&
                <h3>{this.members.length}</h3>
            }
        </div>;
    }

}

export default VoterCamp
