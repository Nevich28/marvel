import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import './charSearch.scss';


const CharSearch = () => {
    const {loading, error, getSearchChar, clearError} = useMarvelService();
    const [findedChar, setfindedChar] = useState('');
    const [findedId, setfindedId] = useState('');


    const onCharLoaded = (char) => {
        setfindedChar(char.name);
        setfindedId(char.id);
    }
    


    const searchChar = (name) => {
        clearError();
        setfindedChar('');
        getSearchChar(name)
            .then(onCharLoaded);
    }

    const findCharMes = findedChar !== '' && findedChar !== 'no' ? 
                        <div className="char__search-done">There is! Visit {findedChar} page?</div> : null;
    const notFindCharMes = findedChar !== '' && findedChar === 'no' ?
                        <div className="char__search-error">The character was not found. Check the name and try again</div> : null;
                                            
    const toCharBtn = findedChar !== '' && findedChar !== 'no' ? 
                                    <Link to={`/character/${findedId}`} className="button button__secondary char__search-mt15">
                                        <div className="inner">TO PAGE</div>
                                    </Link> :
                                    null;
    const errorMessage = error ?
                                <div className="char__search-error">Data base erorr...</div> : null;
    const spinner = loading ? <div className="char__search-done">Loading...</div> : null;

    return (
        <Formik
            initialValues = {{
                name: ''
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                        .min(4, 'Minimum 4 char!')
                        .required('This field is required')
            })}
            onSubmit = {values => searchChar(values.name)}>
            <div className="char__search">
                <div className="char__search-name">Or find a character by name:</div>
                <Form className="char__form" action="">
                    <div className="char__form-wrapper">
                        <Field
                            id="name"
                            className="char__form-input"
                            name="name"
                            placeholder="Enter name"
                        />
                        {/* <div className="char__search-error">{findedChar}</div> */}
                        <ErrorMessage className="char__search-error" name="name" component="div"/>
                        {errorMessage}
                        {spinner}
                        {findCharMes}
                        {notFindCharMes}
                    </div>
                    <div>
                        <button type="submit" className="button button__main" disabled={loading}>
                            <div className="inner">FIND</div>
                        </button>
                        {toCharBtn}
                    </div>
                </Form>
            </div>
        </Formik>
    )
}

export default CharSearch;