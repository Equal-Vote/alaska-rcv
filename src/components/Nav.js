import { Box, Typography } from '@mui/material';
import { dimensionNames } from '../Transitions';
import { DimensionButtons, getDimensionFromURL } from '../TransitionTemplates';
import EqualLogo from '../assets/equal_logo.png'
import EqualLogoSmall from '../assets/equal_logo_small.png'
import AlaskaSpecial2022 from '../content/AlaskaSpecial2022';

export default ({election, navTop}) => {
    let icon = undefined;

    try{
        icon = require(`../assets/nav/${election.tag}.png`)
    }catch(e){
        icon = undefined;
    }

    return <Box className='Nav' display='flex' flexDirection='column' sx={{
        width: '100%',
        top: `${navTop == 0 ? 0 : '-50%'}`, // I think this 50% is screen height, so we don't want to do 100
        transition: 'top 1s',
        position: election? 'absolute' : 'relative',
        overflow: election? 'hidden' : 'unset',
        //overflow: {xs: 'unset', md: 'hidden'},
    }}>
        <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            sx={{
                gap: {xs: '5px', md: '15px'},
                background: 'black', paddingLeft: '20px', 
                height: '77px'
            }}
        >
            <a href='https://equal.vote'>
                <Box sx={{
                    height: {xs: '35px', md: '50px'},
                    width: {xs: '35px', md: '184px'},
                    backgroundImage: {xs: `url(${EqualLogoSmall})`, md: `url(${EqualLogo})`},
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    paddingTop:'0px',
                    paddingBottom:'0px'
                }}/>
            </a>
            <span className='NavArrow'>{">"}</span>
            <a href='/'>
                <div className='NavButton'>
                <img src={require('../assets/usa_nav.png')}/>
                <h4>RCV Case Studies</h4>
                </div>
            </a>
            {getDimensionFromURL(0) != '' && <><span className='NavArrow'>{">"}</span>
                <a href=''>
                    <div className='NavButton'>
                    <h4>{election?.title ?? dimensionNames[getDimensionFromURL(0)]}</h4>
                    </div>
                </a>
            </>}
        </Box>
        <Box display='flex' flexDirection='column' justifyContent='center' sx={{minHeight: '128px', background: 'var(--brand-ltblue)'}}>
            <h1 style={{color: 'white', textAlign: 'center', fontSize: '32px'}}>
                {election == undefined ? 'Ranked Choice Voting - Case Studies' : election.title}
            </h1>
        </Box>
        <Box display='flex' flexDirection='column' justifyContent='center' sx={{minHeight: '77px', background: 'var(--brand-dkblue)'}}>
            <DimensionButtons election={AlaskaSpecial2022} excludeSelected center/>
        </Box>
        {/*<Box display='flex' flexDirection='row' gap='20px' sx={{color: 'white', background: 'black', ml: 10}}>
            <Typography >Articles for this election:</Typography>
            <Typography sx={{textDecoration: 'underline'}}>Overview</Typography>
            <Typography>The full story</Typography>
            <Typography>What if we used STAR?</Typography>
            <Typography>Rank all republicans?</Typography>
        </Box>*/}
    </Box>
}