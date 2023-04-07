import { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            // break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            // break;
        case 'confirmed':
            return <Component/>;
            // break;
        case 'error':
            return <ErrorMessage/>;
            // break;
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
        
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
                <CSSTransition key={item.id} timeout={500} classNames={activeClass}>
                    <li 
                        className={activeClass}
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        
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
                </CSSTransition>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    return (
        <div className="char__list">
            {setContent(process, () => renderItems(char), newItemLoading)}
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