import { Box } from "@mui/material"

export default () => {
    const ListBox = ({title, items}) => <Box sx={{background: 'blue', p: 2, borderRadius: 2}}>
        <h2>{title}</h2>
        <ul>
            {items.map(item => <li>{item}</li>)} 
        </ul>
    </Box>

    return <Box display='flex' flexDirection='row' gap={10} sx={{mx: 'auto', mt: 10}}>
        <ListBox title='Elections' items={['NYC', 'Alaska', 'Burlington']}/>
        <ListBox title='Areas of Interest' items={['Spoiler Effect', 'Rank The Red', 'STAR Conversion']}/>
    </Box>
}