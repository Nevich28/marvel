import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import setContent from '../../utils/setContent';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.charId])  

    const updateChar = () => {
        clearError();
        const {charId} = props;
        if (!charId) {
            return;
        }
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
    <div className="char__info">
        {setContent(process, View, char)}
    </div>
    )

}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics, imgAviable} = data;
    const styleImg = {
        objectFit: imgAviable ? 'cover' : 'contain'
    }
    return (
        <>
            <div className="char__basics">
                <img style={styleImg} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'No comics'}
                {
                    comics.map((item, i) => {
                        const id = item.resourceURI.substr(item.resourceURI.lastIndexOf('/')+1);
                        if (i > 9) {
                            return null;
                        }
                        return (
                            <li key={i} className="char__comics-item">
                                <Link to={`/comics/${id}`} className="single-comic__back">{item.name}</Link>
                                
                            </li>
                        )
                    })                
                }               
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;