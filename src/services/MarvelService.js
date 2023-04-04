import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    //It is my api key
    const _apiKey = 'apikey=17a496dd1809ecba99cea7f9d870ae62';
    const _baseOffset = 210;
    const _baseOffsetComics = 60;
    

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseOffsetComics) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics)
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            name: char.name,
            id: char.id,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            imgAviable: char.thumbnail.path.indexOf('image_not_available') > 0 ? false : true,
            comics: char.comics.items
        }
    }
    
    const _transformComics = (comics) => {
        return {
            title: comics.title,
            id: comics.id,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension
        }
    }

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getComic, clearError}
}

export default useMarvelService;