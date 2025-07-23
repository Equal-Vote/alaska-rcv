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
    extraContext: <p>
        While RCV was used for the primary it will not be used in the general election. That election which will feature Zohran Mamdani, the democratic nominee, as well as Andrew Cuomo and Eric Adams both of whom will be running as independents, and Curtis Sliwa (R). This election under Choose One Plurality voting will have a high likely of vote-splitting.
    </p>,
} satisfies ElectionDetails;