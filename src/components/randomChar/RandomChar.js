import { Component } from 'react';

import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 10000);
    }

    componentWillUnmount() {
        // clearInterval(this.timerId);
    }

    onError = () => {
        this.setState({ 
            loading: false,
            error: true
        })
    }

    marvelServices = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelServices
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    descriptionMod = (description) => {
        if (description) {
            if (description.length > 150 ) {
                return description.substring(0,150) + '...';
            } else {
                return description;
            }
        } else {
            return 'Description is not aviable :(';
        };
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, description, homepage, wiki, imgAviable} = char;
    const styleImg = {
        objectFit: imgAviable ? 'cover' : 'contain'
    }
     
    let resDescription = '';
    if (description) {
        if (description.length > 150 ) {
            resDescription = description.substring(0,150) + '...';
        } else {
            resDescription = description;
        }
    } else {
        resDescription = 'Description is not aviable :(';
    };

    return (
        <div className="randomchar__block">
            <img style={styleImg} src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {resDescription}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;