import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './comicsList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded);
    }

    const onComicsLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 8) {
            ended = true;
        }
        setChar(char => [...char, ...newChar]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setCharEnded(ended);
    }

    function renderItems(arr) {
        const items = arr.map(item => {
            const currentPrise = item.price === 0 ? 'NOT AVAILABLE' : `${item.price}$`;
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{currentPrise}</div>
                    </Link>
                </li>
            )
        })
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(char)
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;