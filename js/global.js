const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

window.onload = function () {

    /**
     * Gestão de usuário com Firebase Authentication
     **/
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            /**
             * Quando o usuário está logado.
             **/
            _('#usuarioAcao img').src = user.photoURL;
            _('#usuarioAcao').title = `Olá ${user.displayName}!`;
            _('#usuarioAcao img').alt = `Olá ${user.displayName}!`;

            if (site.verPerfil) {
                _('#usuarioAcao').setAttribute('data-acao', 'perfil');
                _('#usuarioAcao').href = 'perfil.html';
                _('#usuarioAcao span').innerHTML = "Perfil";
            } else {
                _('#usuarioAcao').setAttribute('data-acao', 'logout');
                _('#usuarioAcao').href = 'logout.html';
                _('#usuarioAcao span').innerHTML = "Logout";
            }

            updateUser(user);

        } else {

            /**
             * Quando o usuário não está logado.
             **/
            _('#usuarioAcao').setAttribute('data-acao', 'login');
            _('#usuarioAcao').href = 'login.html';
            _('#usuarioAcao').title = `Logue-se!`;
            _('#usuarioAcao img').src = 'img/anonimo.png';
            _('#usuarioAcao img').alt = `Logue-se!`;
            _('#usuarioAcao span').innerHTML = "Login";

        }
    });

    /**
     * Monitora cliques na interação do usuário no menu principal.
     **/
    _('#usuarioAcao').addEventListener('click', (evento) => {
        evento.preventDefault();
        let acao = _('#usuarioAcao').getAttribute('data-acao');
        switch (acao) {
            case 'login':
                fbSigIn();
                break;
            case 'logout':
                fbSignOut();
                break;
            case 'perfil':
                location.href = 'perfil.html';
        }
    });
}