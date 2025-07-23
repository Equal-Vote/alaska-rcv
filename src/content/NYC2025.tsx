import {ElectionDetails} from '../Transitions';
import NYCBulletAllocation from './NYCBulletAllocation';
import NYCTallyError from './NYCTallyError';

export default {
    tag: 'nyc25',
    title: 'New York City 2025 Democratic Mayor Election',
    ratio: 5262.5,
    sourceTitle: 'NYC Board of Elections',
    sourceURL: 'https://vote.nyc/page/election-results-summary',
    camps: [0, 7, 6, 16, 53, 9, 6, 16, 71, 16],
    names: {
        left: 'Mamdani',
        center: 'Lander',
        right: 'Cuomo',
    },
    dimensions: [
        'condorcet_success',
        'star-conversion',
    ],
    customDimensions: {},
    centerBeatsRight: true,
} satisfies ElectionDetails;