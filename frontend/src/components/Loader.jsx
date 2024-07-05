/*  composant Loader.jsx : Permet l'affichage d'un loader lorsque la page charge.
    
    Par Paul Jeanroy

    Aucune fonctionnalité

*/

// Import CSS
import '../styles/loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
