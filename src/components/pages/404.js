import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link, useNavigate } from "react-router-dom"

const Page404 = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
            <button 
            className="button button__main button__long"
            style={{margin: '20px auto 0', display: 'block'}}
            onClick={goBack}>Go Back</button>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}}  to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;