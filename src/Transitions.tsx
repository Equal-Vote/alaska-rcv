import { ReactNode } from "react";
// @ts-ignore
import { SimTransition } from "./SimTransition";
import { dimensionTemplates, electionInfo, TransitionGetterGen } from "./TransitionTemplates";
import { VoterMovement } from "./VoterMovement";
import AlaskaGeneral2022 from "./content/AlaskaGeneral2022";
import AlaskaSpecial2022 from "./content/AlaskaSpecial2022";
import Aspen2009 from "./content/Aspen2009";
import Burlington2009 from "./content/Burlington2009";
import Minneapolis2021 from "./content/Minneapolis2021";
import Moab2021 from "./content/Moab2021";
import NYC2021 from "./content/NYC2021";
import Oakland2022 from "./content/Oakland2022";
import Pierce2008 from "./content/Pierce2008";
import SanFrancisco2020 from "./content/SanFrancisco2020";

export const elections: ElectionDetails[] = [
    AlaskaGeneral2022,
    AlaskaSpecial2022,
    Aspen2009,
    Burlington2009,
    Minneapolis2021,
    Moab2021,
    NYC2021,
    Oakland2022,
    Pierce2008,
    SanFrancisco2020,
];

export type ElectionTag = 
    'alaska-special-2022' |
    'alaska-general-2022' | 
    'burlington-2009' |
    'minneapolis-2021' |
    'pierce-2008' |
    'san-francisco-2020' |
    'oakland-2022' |
    'moab-2021' |
    'nyc-2021' |
    'aspen-2009';

export const dimensionNames = {
    'overview': 'Overview',
    'condorcet': 'Condorcet Failure',
    'condorcet_success': 'Condorcet Success',
    'spoiler': 'Spoiler Effect',
    'cycle': 'Condorcet Cycle',
    'majority': 'Majoritarian Failure',
    'upward_mono': 'Upward Monotonicity Pathology',
    'downward_mono': 'Downward Monotonicity Pathology',
    'no_show': 'No Show Failure',
    'compromise': 'Lesser-Evil Failure',
    'tally': 'Tally Error',
    'repeal': 'Repealed',
    'bullet_allocation': 'Bullet Vote Allocation',
    'rank_the_red': 'Rank all Republicans?',
    'star_conversion': 'STAR Conversion',
} as const;

export type DimensionTag = keyof typeof dimensionNames;

export const OVERVIEW_DIMENSIONS: DimensionTag[] = [
    'condorcet',
    'condorcet_success',
    'spoiler',
    'cycle',
    'majority',
    'upward_mono',
    'downward_mono',
    'no_show',
    'compromise',
    'repeal',
];

export interface TransitionGetter {
    electionTag?: ElectionTag;
    dimension?: DimensionTag;
    get: () => SimTransition[];
}
export const makeTransitionGetter = (election: ElectionDetails | undefined, dimension: DimensionTag | undefined, get: () => SimTransition[]): TransitionGetter => ({
    electionTag: election?.tag,
    dimension,
    // adding election tag here since it's tedious to add it in election templates
    get: () => get().map(t => t.setElection(election))
});

export interface ElectionDetails {
    tag: ElectionTag,
    title: string;
    names: {
        left: string,
        center: string,
        right: string
    };
    dimensions: DimensionTag[];
    camps: [
        number, number, number, number, number,
        number, number, number, number, number
    ];
    ratio: number;
    sourceTitle: string;
    sourceURL: string;
    extraBullets?: ReactNode;
    extraContext?: ReactNode;
    upwardMonoMovements?: VoterMovement[];
    downwardMonoMovement?: VoterMovement;
    noShowMovement?: VoterMovement;
    compromiseMovement?: VoterMovement;
    compromiseRunoffStage?: string;
    centerBeatsRight?: boolean;
    repealDetails?: ReactNode;
}

const allGetters = (): TransitionGetter[] => ([
    ...elections.map(election => ([
        electionInfo(election),
        ...election.dimensions 
            .filter((dim:DimensionTag) => dim in dimensionTemplates)
            .sort((a, b) => OVERVIEW_DIMENSIONS.findIndex(d => d == a) - OVERVIEW_DIMENSIONS.findIndex(d => d == b))
            .map((dim:DimensionTag) => dimensionTemplates[dim]!(election))
    ])
    ).flat()
])

export const getTransitions = ({electionTag=undefined, dimension='overview'}: {electionTag?: ElectionTag, dimension?: DimensionTag}): SimTransition[] => ([
    new SimTransition({
        explainer: <div className='explainerTopPadding'/>
    }),
    ...allGetters()
        .filter(getter => electionTag === undefined ? true : getter.electionTag === electionTag)
        .filter(getter => getter.dimension === undefined || (dimension == 'overview' ? OVERVIEW_DIMENSIONS.includes(getter.dimension) : getter.dimension === dimension))
        .map(getter => getter.get())
        .flat(),
    new SimTransition({
        explainer: <div className='explainerBottomPadding'/>
    }),
]);