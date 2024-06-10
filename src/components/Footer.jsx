/* 
    composant Footer.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
    
*/
import '../styles/Footer.css'

export default function Footer(){

    return(
        <footer>
            <h1 className="footer-title">Livret Numérique</h1>
            <nav className="footer-nav">
                <a href="/accueil" className="footer-link">Accueil</a>
                <a href="/livret" className="footer-link">Livret</a>
                <a href="/profil" className="footer-link">Profil</a>
                <a href="/notification" className="footer-link">Notification</a>
            </nav>
            <div className="footer-border"></div>
        </footer>
    )
} 