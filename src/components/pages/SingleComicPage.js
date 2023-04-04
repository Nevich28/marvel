import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';



import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {loading, error, getComic, clearError} = useMarvelService();
    const navigate = useNavigate();
    console.log(navigate);

    useEffect(() => {
        updateComic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comicId])  

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded); 
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;


    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
        
}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic;

    const currentPrise = price === 0 ? 'NOT AVAILABLE' : `${price}$`;
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{currentPrise}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )

}

export default SingleComicPage;