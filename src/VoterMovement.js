import Voter from './components/Voter';

const campIds = [
    'home', 'centerBullet', 'centerThenRight', 'rightThenCenter',
    'rightBullet', 'rightThenLeft', 'leftThenRight',
    'leftBullet', 'leftThenCenter', 'centerThenLeft'
];

export class VoterMovement {
    constructor(count, from, to) {
        // to undefined means starting position
        // from undefined means anywhere
        this.count = count;
        this.from = from;
        this.to = to;
        this.prevCounts = {};
    }

    move(n, from, to, simState) {
        // adding undefined made this messy :'(
        if(to == undefined){
            simState.objects
                .filter(o => o instanceof Voter)
                .forEach(o => o.camp = undefined);
            simState[from].refreshMembers();
            return;
        }

        simState.objects
            .filter(o => o instanceof Voter)
            .filter(o => {
                if(from == 'anywhere') return true; 
                return from == undefined? o.camp == undefined : o.camp == simState[from]
            })
            .sort((l, r) => {
                let dist = (o) => o.pos.subtract(simState[to].pos).magnitude();
                return dist(l) - dist(r);
            })
            .filter((_, i) => i < n)
            .forEach(o => {
                o.camp = simState[to];
                o.phyMass = 1;
            });

        if(from == 'anywhere'){
            campIds.forEach(c => simState[c].refreshMembers());
        }else if(from != undefined){
            simState[from].refreshMembers();
        }

    }

    apply(simState) {
        if(this.from == 'anywhere'){
            this.counts = campIds.map(c => 
                simState.objects
                .filter(o => o instanceof Voter)
                .filter(o => o.camp == c || o.camp == simState[c]).length
            );
        }

        this.move(this.count, this.from, this.to, simState);
    }

    revert(simState) {
        if(this.from == 'anywhere'){
            this.move(200, 'anywhere', 'home', simState);
            campIds.forEach((c, i) => this.move(this.counts[i], 'home', c, simState));
        }else{
            this.move(this.count, this.to, this.from, simState);
        }
    }
}
