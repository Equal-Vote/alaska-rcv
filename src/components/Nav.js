export default ({election, navTop}) => {
    let icon = undefined;

    try{
        icon = require(`../assets/nav/${election.tag}.png`)
    }catch(e){
        icon = undefined;
    }

    return <div className='Nav' style={{paddingLeft: '20px', top: `${navTop}px`}}>
        <a href='https://equal.vote'>
            <div className='NavButton' style={{paddingTop:'0px', paddingBottom:'0px'}}>
                <img src={require('../assets/equal_logo_transparent.png')}/>
            </div>
        </a>
        <span className='NavArrow'>{">"}</span>
        <a href='/'>
            <div className='NavButton'>
            <img src={require('../assets/usa_nav.png')}/>
            <h4>RCV Case Studies</h4>
            </div>
        </a>
        {election && <><span className='NavArrow'>{">"}</span>
            <a href=''>
                <div className='NavButton'>
                {icon && <img src={icon}/>}
                <h4>{election.title}</h4>
                </div>
            </a>
        </>}
    </div>
}