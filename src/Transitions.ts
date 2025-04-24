import Burlington2009 from "./content/Burlington2009";
// @ts-ignore
import { SimTransition } from "./SimTransition";

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

export type DimensionTag = 
    'overview' |
    'spoiler' |
    'condorcet' |
    'condorcet_success' |
    'cycle' | 
    'majority' |
    'upward_mono' |
    'downward_mono' |
    'no_show' |
    'compromise' |
    'tally' |
    'repeal' |
    'bullet_allocation' |
    'rank_the_red' |
    'star_conversion';

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
    dimension: DimensionTag;
    get: () => SimTransition[];
}

const allGetters = (): TransitionGetter[] => ([
    ...Burlington2009(),
])

export const getTransitions = ({election=undefined, dimension='overview'}: {election?: ElectionTag, dimension?: DimensionTag}): SimTransition[] => {
    return allGetters()
        .filter(getter => election === undefined ? true : getter.election === election)
        .filter(getter => dimension == 'overview' ? OVERVIEW_DIMENSIONS.includes(getter.dimension) : getter.dimension === dimension)
        .map(getter => getter.get())
        .flat();
}