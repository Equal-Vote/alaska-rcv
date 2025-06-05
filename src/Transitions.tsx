import { ReactNode } from "react";
// @ts-ignore
import { SimTransition } from "./SimTransition";
import { DimensionButtons, dimensionInfo, dimensionTemplates, electionInfo, TransitionGetterGen } from "./TransitionTemplates";
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
import { Box } from "@mui/material";

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
    'cycle': 'Condorcet Cycle',
    'spoiler': 'Spoiler Effect',
    'majority': 'Majoritarian Failure',
    'upward-mono': 'Upward Monotonicity Pathology',
    'downward-mono': 'Downward Monotonicity Pathology',
    'no-show': 'No Show Failure',
    'compromise': 'Lesser-Evil Failure',
    'repeal': 'Repealed',
    // custom
    'tally': 'Tally Error',
    'bullet-allocation': 'Bullet Vote Allocation',
    'rank-all-republicans': 'What if Republican voters ranked all Republicans?',
    'star-conversion': 'What if we used STAR Voting?',
    'deep-dive': '🔍The Full Story🔍',
    'bettervoting': 'Full BetterVoting Results'
} as const;

export type DimensionTag = keyof typeof dimensionNames;

export const OVERVIEW_DIMENSIONS: DimensionTag[] = [
    'condorcet',
    'condorcet_success',
    'cycle',
    'spoiler',
    'majority',
    'upward-mono',
    'downward-mono',
    'no-show',
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
    customDimensions?: Partial<Record<DimensionTag, string | (() => SimTransition[])>>;
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
        //electionInfo(election),
        ...election.dimensions 
            .filter((dim:DimensionTag) => dim in dimensionTemplates && !(dim in (election?.customDimensions ?? {})))
            .sort((a, b) => {
                const evalItem = (item: DimensionTag) => {
                    if(item == 'overview') return -2;
                    if(item in OVERVIEW_DIMENSIONS) return OVERVIEW_DIMENSIONS.findIndex(d => d == item);
                    return -1;
                }
                return evalItem(a) - evalItem(a);
            })
            .map((dim:DimensionTag) => dimensionTemplates[dim]!(election)),
        ...Object.entries(election?.customDimensions ?? {})
            .filter(([k, v]) => typeof v !== 'string')
            .map(([k, v]) => makeTransitionGetter(election, k as DimensionTag, v as (() => SimTransition[]))),
    ])
    ).flat()
])



export const getTransitions = ({election=undefined, dimension='overview'}: {election?: ElectionDetails, dimension?: DimensionTag}): SimTransition[] => [
    new SimTransition({
        explainer: <div className='explainerTopPadding'/>
    }),
    ...(election === undefined ? makeTransitionGetter(elections[0], dimension, () => dimensionInfo(elections[0], dimension, true)).get() : electionInfo(election, true).get()),
    ...allGetters()
        .filter(getter => election?.tag === undefined ? true : getter.electionTag === election.tag)
        .filter(getter => getter.dimension === undefined || (dimension == 'overview' ?
            OVERVIEW_DIMENSIONS.includes(getter.dimension) :
            getter.dimension === dimension)
        )
        .map(getter => [
            ...(election === undefined?
                electionInfo(elections.filter(e => e.tag == getter.electionTag)[0], false).get()
            :
                dimensionInfo(election, getter.dimension as DimensionTag, false)
            ),
            ...getter.get()
        ])
        .flat(),
    new SimTransition({
        explainer: <Box>
            <a href='#toc'>️↑back to top️↑</a>
            <hr/>
            <p>Read more about this election:</p>
            <DimensionButtons
                election={election === undefined ? undefined : elections.filter(e => e.tag == election?.tag)[0]}
                excludeSelected
            />
        </Box>
    }),
    new SimTransition({
        explainer: <div className='explainerBottomPadding'/>
    }),
];