/**
 * JavaScript do template do site.
 * É executado em todas as páginas.
 * Todo o código global fica aqui, por exemplo, gestão do usuário e
 * tratamento do template.
 **/

/**
 * Inicializa o Firebase e as ferramentas Firestore e Auth
 */
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/**
 * Quando o documento está pronto, roda o JavaScript
 **/
window.onload = () => { // Isso é uma "arrow function"

    // Carrega o template HTML em div#wrap
    _('#wrap').innerHTML = template();

    // Observa as mudanças de status do usuário
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log(user)
        } else {
            console.log('não logado')
        }
    });

    /**
     * Obtém o ano da data atual e atualiza a licensa do site.
     * O elemento span#footerAno está definido em funcoes.js → template()
     **/
    let agora = new Date();
    let ano = agora.getFullYear();
    if (ano > site.ano)
        /**
         * Se o ano atual é maior que o da fundação do site, 
         * mostra o ano de fundação e o atual.
         **/
        _('#footerAno').innerHTML = `${site.ano} ${ano}`;
    else
        /**
         * Se o ano de fundação é o atual,
         * mostra o ano de fundação.
         **/
        _('#footerAno').innerHTML = site.ano;

    _('#usuarioAcao').addEventListener('click', (evento) => {
        // Bloqueia a execução normal do evento
        evento.preventDefault();

        let acao = _('#usuarioAcao').getAttribute('data-acao');
        console.log(acao);
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