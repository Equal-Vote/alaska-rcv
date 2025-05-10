import { Box, Divider } from "@mui/material"
import {dimensionNames, elections} from '../Transitions'

export default () => {
    const getIcon = (electionTag) => {
        try{
            return <img width='50px' src={require(`../assets/nav/${electionTag}.png`)}/>
        }catch(e){
            return undefined;
        }
    }
    const ListBox = ({title, items, mapper}) => {
        let featuredItem = undefined;
        if(items[0] == 'alaska-special-2022'){
            featuredItem = 'alaska-special-2022';
            items = items.slice(1)
        }
        return <Box sx={{width: '100%', p: 2, }}>
            <h2 style={{margin: 'auto', textAlign: 'center'}}>{title}</h2>
            <ul >
                {featuredItem && <fieldset style={
                    {width: '600px', margin: 'auto', marginBottom: '80px', border: '3px solid white', borderRadius: '5px'}
                }>
                    <legend style={{fontSize: '1.2rem'}}>Start Here</legend>
                    <li style={{listStyleType: 'none'}}>
                        <a href={`/${featuredItem}`}><Box display='flex' flexDirection='row' gap={2} alignItems='center' sx={{maxWidth: '800px'}}>
                            {getIcon(featuredItem)}
                            <span>{mapper(featuredItem)}</span>
                        </Box></a>
                    </li>
                </fieldset>}
                <Box display='flex' gap={3} flexDirection='row' flexWrap='wrap' justifyContent='center' alignItems='center'>
                {items.map(item =>
                    <Box style={{border: 'none', width: '400px', height: (featuredItem ? '120px' : '60px')}}>
                        <li style={{listStyleType: 'none'}}>
                            <a href={`/${item}`}><Box display='flex' flexDirection='row' gap={2} alignItems='center' sx={{maxWidth: '800px'}}>
                                {getIcon(item)}
                                <div>{mapper(item)} {!featuredItem && '>'}</div>
                                
                            </Box></a>
                        </li>
                    </Box>
                )} 
                </Box>
            </ul>
        </Box>
    }

    return <Box display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center'
        sx={{mb: 5, p: 5, mx: 'auto', width: '100%', maxWidth: '1500px', mt: 10, background: '#111111', borderRadius: 2}}
    >
        <ListBox title='Elections' items={[
            'alaska-special-2022', ...elections.map(e => e.tag).filter(t => t != 'alaska-special-2022')
        ]} mapper={(key) => elections.filter(e => e.tag == key)[0]?.title ?? ''}/>
        <Box sx={{width: '100%', height: '8px', mb: 3, background: 'black'}}/>
        <ListBox title='Areas of Interest' items={[
            // We don't use dimensionTags here because we only want a subset
            'condorcet_success',
            'condorcet',
            'cycle', 
            'spoiler',
            'majority',
            'upward-mono',
            'downward-mono',
            'no-show',
            'compromise',
            'repeal',
        ]} mapper={(key) => dimensionNames[key]}/>
    </Box>
}