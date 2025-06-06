import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, List, Radio, RadioGroup, Typography } from "@mui/material"
import {DimensionTag, ElectionTag, dimensionNames, elections} from '../Transitions'
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from "react";
// @ts-ignore
import { NAV_HEIGHT } from "./Nav";

interface FilterItem {
    description: string,
    tag: DimensionTag | undefined,
}

export default () => {
    const filters: FilterItem[] = [
        {
            tag: undefined,
            description: 'Show all case studies',
        },
        {
            tag: 'spoiler',
            description: 'When a minor candidate enters a race and pulls votes away from the otherwise winning candidate, causing the winner to change to a different major candidate.'
        },
        {
            tag: 'majority',
            description: 'When the winning candidate does not have the majority of votes in the final round.',
        },
        {
            tag: 'condorcet',
            description: 'A scenario where the voting method doesn\'t elect the candidate who was preferred over all others.',
        },
        {
            tag: 'cycle',
            description: 'A scenario where no Condorcet Winner is present due to a cycle in the head-to-head matchups.',
        },
        {
            tag: 'upward-mono',
            description: 'A scenario where if the winning candidate had gained more support they would have lost.',
        },
        {
            tag: 'downward-mono',
            description: 'A scenario where a losing candidate could have lost support and won.',
        },
        {
            tag: 'compromise',
            description: "A scenario where a group of voters could have strategically elevated the rank of a 'compromise' or 'lesser-evil' candidate over their actual favorite to get a better result.",
        },
        {
            tag: 'no-show',
            description: 'A scenario where a set of voters can get a better result by not voting at all.',
        },
        {
            tag: 'repeal',
            description: 'A scenario where a juristiction reverts back to Choose-One voting after trying RCV.',
        },
        {
            tag: 'tally',
            description: 'A scenario where the election administrators failed to compute the election correctly.',
        },
    ];
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterIndex, setFilterIndex] = useState(0);

    const ListBox = ({items, mapper}: {items: ElectionTag[], mapper: Function}) => {
        let featuredItem: ElectionTag | undefined = undefined;
        if(items[0] == 'alaska-special-2022'){
            featuredItem = 'alaska-special-2022';
            items = items.slice(1)
        }
        return <Box sx={{width: '100%', maxWidth: '1500px', margin: 'auto'}}>
            <List sx={{p: 'unset'}}>
                {featuredItem && <Box display='flex' alignItems='center' flexDirection='column'>
                    <FormControl component='fieldset' sx={
                        {marginBottom: 10, py: 4, px: 8, width: {xs: '100%', md: '800px'}, color: 'var(--brand-yellow)', /*marginBottom: {xs: '20px', md: '80px'},*/ border: '3px solid var(--brand-yellow)', borderRadius: '5px'}
                    }>
                    <legend style={{fontSize: '1.6rem'}}>Featured Case Study</legend>
                    <li style={{listStyleType: 'none'}}>
                        {/* We're assuming that the featured item will have a deep-dive page*/}
                        <a href={`/${featuredItem}/deep-dive`}><Box display='flex' gap={2} alignItems='center' sx={{
                            flexDirection: {xs: 'column', md: 'row'},
                            color: 'white',
                            maxWidth: '800px',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: 'var(--brand-yellow)'
                            }
                        }}>
                            <img width={'300px'} src={require(`../assets/alaska-gif.gif`)}/>
                            <h2>{mapper(featuredItem)}</h2>
                        </Box></a>
                    </li>
                </FormControl></Box>}
                <Box display='flex' flexWrap='wrap' justifyContent='center' alignItems='center' sx={{gap:{xs: 0, md: 10}, flexDirection: {xs: 'column', md: 'row'}}}>
                {items.map((item, i) =>
                    <Box key={i} sx={{border: 'none', width: {xs: 'unset', md: '400px'}, height: (featuredItem ? '120px' : '60px')}}>
                        <li style={{listStyleType: 'none'}}>
                            <a href={`/${item}`}><Box display='flex' flexDirection='row' gap={4} alignItems='center' sx={{
                                color: 'white',
                                maxWidth: '800px',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'var(--brand-yellow)'
                                }
                            }}>
                                <img src={require(`../assets/${elections.filter(e => e.tag == item)[0]?.names.left.toLowerCase() ?? ''}.jpg`)}
                                style={{
                                    width: '100px',
                                    borderRadius: '100%',
                                    borderBlock: 'solid',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    border: `4px solid var(--${elections.filter(e => e.tag == item)[0]?.names.left.toLowerCase() ?? ''})`,
                                }}/>
                                <span>{mapper(item)}</span>
                            </Box></a>
                        </li>
                    </Box>
                )} 
                </Box>
            </List>
        </Box>
    }


    return <Box className='caseList' sx={{mb: 5, mx: 'auto', width: '100%', mt: 10}}>
        <Dialog open={filterOpen}>
            <DialogTitle sx={{background: '#111111'}}><h2>Filter elections by pathology</h2></DialogTitle>
            <DialogContent sx={{background: '#111111'}}>
                <RadioGroup value={filterIndex} onChange={(e) => setFilterIndex(Number(e.target.value))}>
                    {filters.map((f, i) =>
                        <Box key={i} sx={{width: {xs: 'unset', md: '500px'}}}>
                            <FormControlLabel value={i} control={<Radio sx={{color: 'white', fontWeight: '2000', fontSize: '24px'}}/>} label={<>{f.tag === undefined ? 'All Case Studies' : dimensionNames[f.tag]}</>} sx={{ mb: 0, pb: 0}} />
                            {i == filterIndex && <FormHelperText sx={{ pl: 6, mt: 1, mb: 2, color: 'white', fontSize: '16px' }}>{f.description}</FormHelperText>}
                        </Box>
                    )}
                </RadioGroup>
            </DialogContent>
            <DialogActions sx={{background: '#282828'}}>
                <Button onClick={() => setFilterOpen(false)} sx={{marginRight: {xs: 'auto', md: 'unset'} }}>Done</Button>
            </DialogActions>
        </Dialog>
        <Box display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' gap={6}
            sx={{p: {xs: 1, md: 5}, background: 'black', borderRadius: 2, width: '100%', maxWidth: '1500px', margin: 'auto' }}
        >
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <Button sx={{
                    background: 'black',
                    border: '4px solid gray',
                    color: '#AAAAAA',
                    borderRadius: '20px',
                    textTransform: 'none',
                    padding: '5px',
                    px: '20px',
                    fontSize: '20px',
                }} onClick={() => setFilterOpen(true)}>
                    {/*@ts-ignore*/}
                    <strong>Filter List</strong>&nbsp;<FilterListIcon/> : {filters[filterIndex].tag === undefined ? 'All Case Studies' : dimensionNames[filters[filterIndex].tag]}
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