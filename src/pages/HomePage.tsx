import {Link} from "react-router-dom";


const HomePage = () => {
    return (
        <div className={'page'}>
            {/*<span className={'spacer'}></span>*/}
            <span className={'spacer'}></span>
            <h1>Chocolate Game 🍫</h1>
            <div className={'home-page-options-container'}>
                <Link to={'/play-local'} className={'home-page-option'}>
                        Play Local
                </Link>
                <Link to={'/play-online'} className={'home-page-option'}>
                    Play Online
                </Link>
                {/*<Link to={'/play-computer'} className={'home-page-option'}>*/}
                {/*    Play Computer*/}
                {/*</Link>*/}
            </div>
            <span className={'spacer'}></span>
            <p className={'disclaimer'}>© Henry Abrahamsen 2024</p>
        </div>
    )
}

export default HomePage;
