import { ReactNode } from "react";
import Burlington2009 from "./content/Burlington2009";
// @ts-ignore
import { SimTransition } from "./SimTransition";
import { dimensionTemplates, electionInfo, TransitionGetterGen } from "./TransitionTemplates";
import { VoterMovement } from "./VoterMovement";

const elections = [
    Burlington2009,
];

export type ElectionTag = 
    'alaska-special-2022' |
    'alaska-general-2022' | 
    'burlington-2009' |
    'minneapolis-2021' |
    'pierce-2008' |
    'san-francisco-2020' |
    'alameda-2022' |
    'moab-2021' |
    'nyc-2021' |
    'aspen-2009';

export const dimensionNames = {
    'overview': 'Overview',
    'spoiler': 'Spoiler Effect',
    'condorcet': 'Condorcet Failure',
    'condorcet_success': 'Condorcet Success',
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

const OVERVIEW_DIMENSIONS: DimensionTag[] = [
    'spoiler',
    'condorcet',
    'condorcet_success',
    'cycle',
    'majority',
    'upward_mono',
    'downward_mono',
    'no_show',
    'compromise',
];

export interface TransitionGetter {
    election?: ElectionTag;
    dimension?: DimensionTag;
    get: () => SimTransition[];
}
export const makeTransitionGetter = (election: ElectionDetails | undefined, dimension: DimensionTag | undefined, get: () => SimTransition[]): TransitionGetter => ({
    election: election?.tag,
    dimension,
    get: () => {
        // adding election tag here since it's tedious to add it in election templates
        let transitions = get();
        get().forEach(transition =>
            transition.electionTag = election?.tag
        )
        return transitions;
    }
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
    extraContext: ReactNode | undefined;
    upwardMonoMovements?: VoterMovement[];
    downwardMonoMovement?: VoterMovement;
    noShowMovement?: VoterMovement;
    compromiseMovement?: VoterMovement;
    compromiseRunoffStage?: string;
    centerBeatsRight?: boolean
}

const allGetters = (): TransitionGetter[] => ([
    ...elections.map(election => {
    return [
        electionInfo(election),
        ...election.dimensions
            .filter((dim:DimensionTag) => dim in dimensionTemplates)
            .map((dim:DimensionTag) => dimensionTemplates[dim]!(election))
    ]}
    ).flat()
])

export const getTransitions = ({election=undefined, dimension='overview'}: {election?: ElectionTag, dimension?: DimensionTag}): SimTransition[] => {
    return [
        new SimTransition({
            explainer: <div className='explainerTopPadding'/>
        }),
        ...allGetters()
            .filter(getter => election === undefined ? true : getter.election === election)
            .filter(getter => getter.dimension === undefined || (dimension == 'overview' ? OVERVIEW_DIMENSIONS.includes(getter.dimension) : getter.dimension === dimension))
            .map(getter => getter.get())
            .flat(),
        new SimTransition({
            explainer: <div className='explainerBottomPadding'/>
        }),
    ];
}