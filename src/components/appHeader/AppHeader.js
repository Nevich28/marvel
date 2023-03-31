import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="https://anydesk.com/ru/downloads/windows?dv=win_exe">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><a href="https://anydesk.com/ru/downloads/windows?dv=win_exe">Characters</a></li>
                    /
                    <li><a href="https://anydesk.com/ru/downloads/windows?dv=win_exe">Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;