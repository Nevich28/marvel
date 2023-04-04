import { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {
    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded);
        
    }

    const onCharLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        }
        setChar(char => [...char, ...newChar]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
        
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const {charId} = props;     
        const items =  arr.map((item, i) => {
            const activeClass = (item.id === charId ? 'char__item char__item_selected' : 'char__item')
            const styleImg = {
                objectFit: item.imgAviable ? 'cover' : 'contain'
            }
            
            return (
                <li 
                    className={activeClass}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={styleImg}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(char)
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    if (loading) {
        import('./someFunc')
            .then(obj => obj.loger())
            .catch();
    }

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset, false)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
    charId: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number
    ])
}

export default CharList;