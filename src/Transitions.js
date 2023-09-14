import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';

export const transitions = [
    // moving voters
    new SimTransition({
        explainer: <h1>Begich Bullet Voters</h1>,
        voterMovement: new VoterMovement(12, 'home', 'begich_bullet')
    }),
    new SimTransition({
        explainer: <h1>Begich Then Palin Voters</h1>,
        voterMovement: new VoterMovement(29, 'home', 'begich_then_palin'),
    }),
    new SimTransition({
        explainer: <h1>Palin Then Begich Voters</h1>,
        voterMovement: new VoterMovement(36, 'home', 'palin_then_begich'),
    }),
    new SimTransition({
        explainer: <h1>Palin Bullet</h1>,
        voterMovement: new VoterMovement(23, 'home', 'palin_bullet'),
    }),
    new SimTransition({
        explainer: <h1>Palin Then Peltola</h1>,
        voterMovement: new VoterMovement(4, 'home', 'palin_then_peltola'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Then Palin</h1>,
        voterMovement: new VoterMovement(5, 'home', 'peltola_then_palin'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Bullet</h1>,
        voterMovement: new VoterMovement(25, 'home', 'peltola_bullet'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Then Begich</h1>,
        voterMovement: new VoterMovement(50, 'home', 'peltola_then_begich'),
    }),
    new SimTransition({
        explainer: <h1>Begich Then Peltola</h1>,
        voterMovement: new VoterMovement(16, 'home', 'begich_then_peltola'),
    }),
];
