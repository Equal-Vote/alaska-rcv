import Voter from './components/Voter';

export class VoterMovement {
    constructor(count, from, to) {
        // to undefined means starting position
        // from undefined means anywhere
        this.count = count;
        this.from = from;
        this.to = to;
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
            simState.home.refreshMembers();
            simState.begich_bullet.refreshMembers();
            simState.begich_then_palin.refreshMembers();
            simState.palin_then_begich.refreshMembers();
            simState.palin_bullet.refreshMembers();
            simState.palin_then_peltola.refreshMembers();
            simState.peltola_then_palin.refreshMembers();
            simState.peltola_bullet.refreshMembers();
            simState.peltola_then_begich.refreshMembers();
            simState.begich_then_peltola.refreshMembers();
        }else if(from != undefined){
            simState[from].refreshMembers();
        }
    }

    apply(simState) {
        this.move(this.count, this.from, this.to, simState);
    }

    revert(simState) {
        this.move(this.count, this.to, this.from, simState);
    }


}
