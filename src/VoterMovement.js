import Voter from './components/Voter';

export class VoterMovement {
    constructor(count, from, to) {
        this.count = count;
        this.from = from;
        this.to = to;
    }

    move(n, from, to, simState) {
        simState.objects
            .filter(o => o instanceof Voter)
            .filter(o => o.camp == simState[from])
            .sort((l, r) => {
                let dist = (o) => o.pos.subtract(simState[to].pos).magnitude();
                return dist(l) - dist(r);
            })
            .filter((_, i) => i < n)
            .forEach(o => {
                o.camp = simState[to];
                o.phyMass = 1;
            });

        simState[from].refreshMembers();
    }

    apply(simState) {
        this.move(this.count, this.from, this.to, simState);
    }

    revert(simState) {
        this.move(this.count, this.to, this.from, simState);
    }
}
