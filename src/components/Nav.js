export default () => {
    let params = new URLSearchParams(window.location.search)
    return <div className='nav'>
        {params.get('onlySelector') == 'true' ?
            <a href='/'>Full Alaska Article</a>
            :
            <a href='?selectorElection=burlington-2009&selectorFailure=<pick+a+failure+type>&onlySelector=true'>More Case Studies</a>
        }
    </div>
}