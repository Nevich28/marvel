import { useState, useEffect } from 'react';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import './randomChar.scss';

const RandomChar = () => {

    const [char, setChar] = useState({});
    const {getCharacter, clearError, process, setProcess} = useMarvelService();
    useEffect(() => {
        updateChar();
        // const timerId = setInterval(updateChar, 10000);

        // return () => {
        //     clearInterval(timerId);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }
    
    return (
        <div className="randomchar">
            {setContent(process, View, char)}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const descriptionMod = (description) => {
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

const View = ({data}) => {
    const {name, thumbnail, description, homepage, wiki, imgAviable} = data;
    const styleImg = {
        objectFit: imgAviable ? 'cover' : 'contain'
    }   
    const resDescription = descriptionMod(description);

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