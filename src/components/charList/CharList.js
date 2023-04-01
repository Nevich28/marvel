import { Component } from 'react';
import { PropTypes } from 'prop-types';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1541,
        charEnded: false
    }

    componentDidMount() {
        this.onRequest();
    }

    onError = () => {
        this.setState({ 
            loading: false,
            error: true
        })
    }

    marvelServices = new MarvelService();

    onCharLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        }
        this.setState(({offset, char}) => ({
                char: [...char, ...newChar], 
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
        }))
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelServices.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    updateChar = () => {
        this.marvelServices
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        // this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        // this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {
        const {charId} = this.props;     
        const items =  arr.map((item, i) => {
            const activeClass = (item.id === charId ? 'char__item char__item_selected' : 'char__item')
            const styleImg = {
                objectFit: item.imgAviable ? 'cover' : 'contain'
            }
            
            return (
                <li 
                    className={activeClass}
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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

    render() {
        const {char, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(char)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func,
    charId: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number
    ])
}

export default CharList;