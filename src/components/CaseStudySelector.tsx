import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormHelperText, Radio, RadioGroup, Typography } from "@mui/material"
import {DimensionTag, ElectionTag, dimensionNames, elections} from '../Transitions'
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from "react";

interface FilterItem {
    name: string,
    description: string,
    tag?: DimensionTag
}
export default () => {
    const filters: FilterItem[] = [
        {
            name: 'Spoiler Effect',
            description: 'When a losing candidate changes the winner',
            tag: 'spoiler',
        },
        {
            name: 'Monotonicity',
            description: 'When a winning candidate could have gained supports and lost',
            tag: 'upward-mono',
        },
        {
            name: 'Condorcet Failure',
            description: 'When a unrepresentative winner is selected',
            tag: 'condorcet',
        },
        {
            name: 'All Elections',
            description: 'Show all elections',
            tag: undefined,
        },
    ];
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterIndex, setFilterIndex] = useState<number>(filters.length-1);

    const getIcon = (electionTag: ElectionTag | undefined) => {
        try{
            return <img width='50px' src={require(`../assets/nav/${electionTag}.png`)}/>
        }catch(e){
            return undefined;
        }
    }

    const ListBox = ({items, mapper}: {items: ElectionTag[], mapper: Function}) => {
        let featuredItem: ElectionTag | undefined = undefined;
        if(items[0] == 'alaska-special-2022'){
            featuredItem = 'alaska-special-2022';
            items = items.slice(1)
        }
        return <Box sx={{width: '100%', }}>
            <ul >
                {featuredItem && <fieldset style={
                    {width: '600px', margin: 'auto', marginBottom: '80px', border: '3px solid white', borderRadius: '5px'}
                }>
                    <legend style={{fontSize: '1.2rem'}}>Featured Case Study</legend>
                    <li style={{listStyleType: 'none'}}>
                        {/* We're assuming that the featured item will have a deep-dive page*/}
                        <a href={`/${featuredItem}/deep-dive`}><Box display='flex' flexDirection='row' gap={2} alignItems='center' sx={{maxWidth: '800px'}}>
                            {getIcon(featuredItem)}
                            <span>{mapper(featuredItem)}</span>
                        </Box></a>
                    </li>
                </fieldset>}
                <Box display='flex' gap={3} flexDirection='row' flexWrap='wrap' justifyContent='center' alignItems='center'>
                {items.map((item, i) =>
                    <Box key={i} style={{border: 'none', width: '400px', height: (featuredItem ? '120px' : '60px')}}>
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

    return <Box sx={{mb: 5, mx: 'auto', width: '100%', maxWidth: '1500px', mt: 10}}>
        <Dialog open={filterOpen}>
            <DialogTitle sx={{background: '#111111'}}><h2>Filter elections by pathology</h2></DialogTitle>
            <DialogContent sx={{background: '#111111'}}>
                <RadioGroup value={filterIndex} onChange={(e) => setFilterIndex(Number(e.target.value))}>
                    {filters.map((f, i) =>
                        <Box key={i}>
                            <FormControlLabel value={i} control={<Radio sx={{color: 'white', fontWeight: 'bold'}}/>} label={f.name} sx={{ mb: 0, pb: 0}} />
                            <FormHelperText sx={{ pl: 4, mt: -1, color: 'white' }}>{f.description}</FormHelperText>
                        </Box>
                    )}
                </RadioGroup>
            </DialogContent>
            <DialogActions sx={{background: '#111111'}}>
                <Button onClick={() => setFilterOpen(false)}>Done</Button>
            </DialogActions>
        </Dialog>
        <h1 style={{color: 'white', textAlign: 'center'}}>Ranked Choice Voting - Case Studies</h1>
        <Box display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center'
            sx={{p: 5, background: '#111111', borderRadius: 2}}
        >
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2}}>
                <Button sx={{
                    background: 'black',
                    border: '2px solid gray',
                    color: 'gray',
                    borderRadius: '20px',
                    textTransform: 'none',
                    padding: '5px',
                    px: '20px',
                }} onClick={() => setFilterOpen(true)}>
                    <strong>Filter</strong>&nbsp;<FilterListIcon/> : {filters[filterIndex].name}
                </Button>
            </Box>
            <ListBox items={
                elections
                    .sort((a, b) => a.tag == 'alaska-special-2022' ? -1 : 1 )
                    .filter(e => filters[filterIndex].tag === undefined || e.dimensions.includes(filters[filterIndex].tag as DimensionTag))
                    .map(e => e.tag)
                //'alaska-special-2022', ...elections.map(e => e.tag).filter(t => t != 'alaska-special-2022')
            } mapper={(key: string) => elections.filter(e => e.tag == key)[0]?.title ?? ''}/>
        </Box>
    </Box>
}