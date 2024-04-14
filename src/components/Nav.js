export default ({navTop}) => {
    let params = new URLSearchParams(window.location.search)

    const navs = [
        {
            icon: require('../assets/alaska_nav.png'),
            text: 'Alaska Deep Dive',
            href: '?enabled=true'
        },
        {
            icon: require('../assets/usa_nav.png'),
            text: 'More Case Studies',
            href: '?enabled=true&selectorElection=burlington-2009&selectorFailure=pick+a+failure+type&onlySelector=true'
        },
        {
            icon: require('../assets/equal_logo.png'),
            text: 'Equal Vote',
            href: 'https://equal.vote'
        },
    ];

    return <div className={`Nav ${params.get('onlySelector') == 'true'? 'USA' : 'Alaska'}`} style={{paddingLeft: '20px', top: `${params.get('onlySelector') == 'true'? 0 : navTop}px`}}>
        {navs.map(item => <a href={item.href}><div className='NavButton'>
            <img src={item.icon}/>
            <h4>{item.text}</h4>
        </div></a>
        )}
    </div>
}