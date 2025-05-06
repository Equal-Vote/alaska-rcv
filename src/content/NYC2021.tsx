import {ElectionDetails} from '../Transitions';

//...nycTallyError(ELECTIONS.nyc_2021),
//...nycBulletAllocation(ELECTIONS.nyc_2021),
export default {
    tag: 'nyc-2021',
    title: 'New York City 2021 Democratic Mayor Election',
    ratio: 4355.9,
    sourceTitle: 'Harvard Dataverse',
    sourceURL: 'https://dataverse.harvard.edu/file.xhtml?fileId=6707224&version=7.0',
    camps: [0, 17, 30, 24, 19, 18, 21, 35, 25, 11],
    names: {
        left: 'Adams',
        center: 'Wiley',
        right: 'Garcia',
    },
    dimensions: [
        'condorcet_success',
        'tally',
        'majority',
        'bullet_allocation',
        'star_conversion',
    ],
    centerBeatsRight: true,
} satisfies ElectionDetails;