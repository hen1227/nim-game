import {Link} from "react-router-dom";


const HomePage = () => {
    return (
        <div className={'page'}>
            {/*<span className={'spacer'}></span>*/}
            <span className={'spacer'}></span>
            <h2>Chocolate Game</h2>
            <div className={'home-page-options-container'}>
                <Link to={'/play-local'}>
                    <button className={'home-page-option'}>
                        Play Local
                    </button>
                </Link>
                <Link to={'/play-online'}>
                    <button className={'home-page-option'}>
                        Play Online
                    </button>
                </Link>
            </div>
            <span className={'spacer'}></span>
            <p className={'disclaimer'}>© Henry Abrahamsen 2024</p>
        </div>
    )
}

export default HomePage;
