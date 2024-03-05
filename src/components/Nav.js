export default ({navTop}) => {
    let params = new URLSearchParams(window.location.search)

    const navs = [
        {
            icon: require('../assets/equal_logo.png'),
            text: 'Return to Equal Vote',
            href: 'https://equal.vote'
        },
    ];

    if(params.get('onlySelector') == 'true'){
        navs.push({
            icon: require('../assets/alaska_nav.png'),
            text: 'Alaska Article',
            href: '/'
        });
    }else{
        navs.push({
            icon: require('../assets/usa_nav.png'),
            text: 'More Case Studies',
            href: '?selectorElection=burlington-2009&selectorFailure=pick+a+failure+type&onlySelector=true'
        });
    }
        //{params.get('onlySelector') == 'true' ?
        //    <a href='/'>Full Alaska Article</a>
        //    :
        //    <a href='?selectorElection=burlington-2009&selectorFailure=pick+a+failure+type&onlySelector=true'>More Case Studies</a>
        //}
    return <div className={`Nav ${params.get('onlySelector') == 'true'? 'USA' : 'Alaska'}`} style={{top: `${params.get('onlySelector') == 'true'? 0 : navTop}px`}}>
        {navs.map(item => <a href={item.href}><div className='NavButton'>
            <img src={item.icon}/>
            <h3>{item.text}</h3>
        </div></a>
        )}
    </div>
}