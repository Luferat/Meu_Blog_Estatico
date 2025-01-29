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

/**
 * Quando o documento está pronto, roda o JavaScript
 **/
window.onload = () => { // Isso é uma "arrow function"

    /**
     * Altera o <title> padrão da página atual.
     **/
    document.title = site.nome;

    // Carrega o template HTML em div#wrap
    _('#wrap').innerHTML = template();

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

}