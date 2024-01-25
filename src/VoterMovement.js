import Voter from './components/Voter';

const campIds = [
    'home', 'centerBullet', 'centerThenRight', 'rightThenCenter',
    'rightBullet', 'rightThenLeft', 'leftThenRight',
    'leftBullet', 'leftThenCenter', 'centerThenLeft'
];

export class VoterMovement {
    constructor(count, from=undefined, to=undefined) {
        // to undefined means starting position
        // from undefined means anywhere
        this.count = count;
        this.from = from;
        this.to = to;
        this.prevCounts = {};
    }

    move(n, from, to, simState, updateFinalCamp=false) {
        if(Array.isArray(n)){
            n = [...n];

            // first first release the camps that have excess
            campIds.forEach((c, i) => {
                let votersInCamp = simState.objects
                    .filter(o => o instanceof Voter)
                    .filter(o => o.camp == simState[c])
                    .sort((l, r) => {
                        let dist = (o) => o.pos.subtract(simState.home.pos).magnitude();
                        return dist(l) - dist(r); // furthest first
                    });

                let diff = votersInCamp.length - n[i];
                
                if(diff > 0){
                    votersInCamp
                        .filter((o, i) => i < diff)
                        .forEach(o => {
                            o.camp = simState.home;
                            o.phyMass = 1;
                        });
                }
                if(diff >= 0){
                    n[i] = 0;
                }else{
                    n[i] = -diff;
                }
            })

            // move all undefineds to home
            new VoterMovement(200, 'anywhere', 'home').apply(simState);

            // then have everything else grab from home
            campIds.forEach((c, i) => {
                if(n[i] == 0) return;
                new VoterMovement(n[i], 'home', c).apply(simState, true);
            })

            campIds.forEach(c => simState[c].refreshMembers());
            return;
        }

        // adding undefined made this messy :'(
        if(to == undefined){
            console.log("reset all positions");
            simState.objects
                .filter(o => o instanceof Voter)
                .forEach(o => {
                    o.resetToStartPos(); // must set position early so that voters can be assigned properly later
                    o.camp = undefined
                });
            if(from == 'anywhere'){
                campIds.forEach(c => simState[c].refreshMembers());
            }else if(from != undefined){
                simState[from].refreshMembers();
            }
            return;
        }
        
        simState.objects
            .filter(o => o instanceof Voter)
            .filter(o => {
                if(from == 'anywhere') return true; 
                return from == undefined? o.camp == undefined : o.camp == simState[from]
            })
            .sort((l, r) => {
                let campScore = (o) => o.finalCamp != simState[to];
                let dist = (o) => {
                    // when coming from outside the circle, use the angle distance
                    if(o.pos.magnitude() > 50){
                        return o.clockAngle();
                    }else{
                        return o.pos.subtract(simState[to].pos).magnitude();
                    }
                };
                return 1000 * (campScore(l) - campScore(r)) + dist(l) - dist(r);
            })
            .filter((_, i) => i < n)
            .forEach(o => {
                if(updateFinalCamp)
                    o.finalCamp = simState[to];
                o.camp = simState[to];
                o.phyMass = 1;
            });

        if(from == 'anywhere'){
            campIds.forEach(c => simState[c].refreshMembers());
        }else if(from != undefined){
            simState[from].refreshMembers();
        }
    }

    apply(simState, updateFinalCamp=false) {
        if(this.from == 'anywhere'){
            // only recording this for reverting
            this.counts = campIds.map(c => 
                simState.objects
                .filter(o => o instanceof Voter)
                .filter(o => o.camp == c || o.camp == simState[c]).length
            );
        }

        this.move(this.count, this.from, this.to, simState, updateFinalCamp);
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
