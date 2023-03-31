import { Component } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false
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

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onRequest = (offset) => {
        this.marvelServices.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    updateChar = () => {
        this.marvelServices
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    renderItems(arr) {
        
        const items =  arr.map((item) => {
            const styleImg = {
                objectFit: item.imgAviable ? 'cover' : 'contain'
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
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
        const {char, loading, error} = this.state;
        const items = this.renderItems(char)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}


export default CharList;