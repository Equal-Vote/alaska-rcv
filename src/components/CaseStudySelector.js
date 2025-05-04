import { Box } from "@mui/material"
import { electionTags } from "../Transitions"

export default () => {
    const ListBox = ({title, items}) => <Box sx={{background: '#111111', maxWidth: '400px', width: '100%', p: 2, borderRadius: 2}}>
        <h2>{title}</h2>
        <ul >
            {items.map(item => <li style={{padding: 4, listStyleType: 'none'}}><a href={`/${item}`}>{item} {'>'}</a></li>)} 
        </ul>
    </Box>

    return <Box display='flex' flexDirection='row' flexWrap='wrap' gap={10} justifyContent='center' sx={{p: 5, mx: 'auto', width: '100%', maxWidth: '1000px', mt: 10}}>
        <ListBox title='Elections' items={[
            'alaska-special-2022',
            'alaska-general-2022',
            'burlington-2009',
            'minneapolis-2021',
            'pierce-2008',
            'san-francisco-2020',
            'alameda-2022',
            'moab-2021',
            'nyc-2021',
            'aspen-2009'
        ]}/>
        <ListBox title='Areas of Interest' items={[
            // We don't use dimensionTags here because we only want a subset
            'spoiler',
            'condorcet',
            'condorcet_success',
            'cycle', 
            'majority',
            'upward_mono',
            'downward_mono',
            'no_show',
            'compromise',
            'repeal',
        ]}/>
    </Box>
}