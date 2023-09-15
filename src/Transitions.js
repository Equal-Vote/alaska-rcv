import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';
import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';

export const transitions = [
    new SimTransition({
        visible: ['choose_one'],
        explainer: <h1>For decades, we've been cursed with a voting method where it's not safe to pick your favorite</h1>,
    }),
    new SimTransition({
        visible: ['alaska'],
        explainer: <h1>But in 2022, Alaska made a change and adopted Ranked Choice Voting</h1>,
        explainerDelaySeconds: .5,
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Add Voters</h1>,
    }),
    // moving voters
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Begich Bullet Voters</h1>,
        voterMovement: new VoterMovement(12, 'home', 'begich_bullet')
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Begich Then Palin Voters</h1>,
        voterMovement: new VoterMovement(29, 'home', 'begich_then_palin'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Palin Then Begich Voters</h1>,
        voterMovement: new VoterMovement(36, 'home', 'palin_then_begich'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Palin Bullet</h1>,
        voterMovement: new VoterMovement(23, 'home', 'palin_bullet'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Palin Then Peltola</h1>,
        voterMovement: new VoterMovement(4, 'home', 'palin_then_peltola'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Peltola Then Palin</h1>,
        voterMovement: new VoterMovement(5, 'home', 'peltola_then_palin'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Peltola Bullet</h1>,
        voterMovement: new VoterMovement(25, 'home', 'peltola_bullet'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Peltola Then Begich</h1>,
        voterMovement: new VoterMovement(50, 'home', 'peltola_then_begich'),
    }),
    new SimTransition({
        visible: [Voter, VoterCamp],
        explainer: <h1>Begich Then Peltola</h1>,
        voterMovement: new VoterMovement(16, 'home', 'begich_then_peltola'),
    }),
];
