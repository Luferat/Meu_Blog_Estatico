/***********************************************
 * Nome do Arquivo: funcoes.js
 * Descrição: Biblioteca de funções JavaScripts de uso geral.
 * Autor: André Luferat
 * Data de Criação: 13/01/2025
 * Última Modificação: 13/01/2025
 * Versão: 1.0
 ***********************************************/

/**
 * Formata uma data no formato especificado.
 * @param {Date} data - A data a ser formatada.
 * @param {string} formato - O formato desejado ('ISO' ou 'BR').
 * @returns {string} A data formatada conforme o formato especificado.
 */
function formatarData(data, formato) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    if (formato === 'ISO') {
        return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    } else if (formato === 'BR') {
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } else {
        throw new Error('Formato inválido. Use "ISO" ou "BR".');
    }
}

/**
 * Obtém a data e hora atual no formato ISO.
 * @returns {string} A data e hora atual no formato ISO.
 */
function agoraISO() {
    const agora = new Date();
    return formatarData(agora, 'ISO');
}

/**
 * Converte uma data do formato ISO para o formato BR.
 * @param {string} dataISO - A data no formato ISO (YYYY-MM-DD HH:MM:SS).
 * @returns {string} A data no formato BR (DD/MM/YYYY HH:MM).
 */
function dataISOparaBR(dataISO) {
    const data = new Date(dataISO);
    return formatarData(data, 'BR');
}

/**
 * Converte uma data do formato JavaScript para o formato ISO.
 * @param {Date} dataJS - A data no formato JavaScript.
 * @returns {string} A data no formato ISO (YYYY-MM-DD HH:MM:SS).
 */
function dataJStoISO(dataJS) {
    const data = new Date(dataJS);
    return formatarData(data, 'ISO');
}

/**
 * Realiza o login do usuário usando o provedor do Firebase Authentication.
 */
function fbSigIn() {
    firebase.auth().signInWithPopup(provider);
}

/**
 * Realiza o logout do usuário no Firebase Authentication.
 */
function fbSignOut() {
    firebase.auth().signOut();
}

/**
 * Cadastra ou atualiza os dados do usuário na coleção `usuarios`.
 * @param {object} user - Dados do usuário do Firebase Authentication.
 */
function updateUser(user) {
    db.collection("usuarios")
        .doc(user.uid)
        .set({
            nome: user.displayName,
            email: user.email,
            foto: user.photoURL,
            data: dataJStoISO(user.metadata.creationTime),
            ultimoLogin: dataJStoISO(user.metadata.lastSignInTime),
        });
}

/**
 * Obtém os dados do usuário a partir do ID do usuário.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<object>} Uma promessa que resolve com os dados do usuário, ou rejeita com um erro se o usuário não for encontrado.
 * @throws {Error} Se o usuário não for encontrado.
 */
async function getUser(userId) {
    const doc = await db.collection('usuarios').doc(userId).get();
    if (doc.exists) {
        return doc.data();
    } else {
        throw new Error("Usuário não encontrado");
    }
}

/**
 * Retorna o "Node" de um elemento ou a "NodeList" de uma coleção de elementos usando o seletor especificado.
 * 
 * @param {string} seletor - O seletor CSS do(s) elemento(s) a ser(em) selecionado(s).
 * @returns {Node|NodeList} O "Node" do elemento se houver apenas um, ou a "NodeList" dos elementos correspondentes.
 * 
 * Exemplos de uso:
 *     Selecionar por ID: let el = _('#meuID'); // Retorna o <div> com o id especificado
 *     Selecionar por classe: let el = _('.minhaClasse'); // Retorna todos os elementos <div> com a classe "minhaClasse"
 *     Selecionar por tag (ou seletores mais complexos): let el = _('div > p'); // Retorna todos os <p> dentro de <div>
 */
function _(seletor) {
    if (seletor.startsWith('#') || seletor.startsWith('.') || seletor.includes(' ')) {
        const resultado = document.querySelectorAll(seletor);
        return resultado.length === 1 ? resultado[0] : resultado;
    }
    return document.querySelectorAll(seletor);
}

/**
 * Remove todas as tags HTML exceto as permitidas e substitui as quebras de linha por <br>.
 * 
 * @param {string} htmlText - O HTML a ser processado.
 * @param {string[]} allowedTags - Lista de tags HTML que devem ser preservadas.
 * @returns {string} - O HTML com apenas as tags permitidas e <br> no lugar das quebras de linha.
 */
function stripTags(htmlText, allowedTags, lineBreaks = false) {
    // Substitui as quebras de linha por um marcador temporário antes de processar
    let preservedLineBreaks = htmlText.replace(/\n/g, '[[LINE_BREAK]]');

    // Cria um elemento div temporário para manipular o HTML
    let div = document.createElement('div');
    div.innerHTML = preservedLineBreaks.trim();

    // Remove qualquer conteúdo dentro de <script> e <style> para evitar código malicioso
    let scripts = div.getElementsByTagName('script');
    let styles = div.getElementsByTagName('style');

    // Remove os nós <script> e <style>
    while (scripts.length > 0) scripts[0].parentNode.removeChild(scripts[0]);
    while (styles.length > 0) styles[0].parentNode.removeChild(styles[0]);

    // Agora, vamos filtrar as tags permitidas
    let childNodes = div.querySelectorAll('*');

    childNodes.forEach(node => {
        // Se a tag não está na lista de permitidas, removemos o nó
        if (!allowedTags.includes(node.nodeName.toLowerCase())) {
            node.replaceWith(...node.childNodes); // Substitui o nó pela parte interna (texto ou outros elementos)
        }
    });

    // Agora, converte os marcadores temporários de volta para <br>
    if (lineBreaks) {
        result = div.innerHTML.replace(/\[\[LINE_BREAK\]\]/g, '<br>');
    } else {
        result = div.innerHTML.replace(/\[\[LINE_BREAK\]\]/g, '');
    }

    // Retorna o HTML com as tags permitidas preservadas e as quebras de linha como <br>
    return result;
}

/**
 * Exibe os comentários associados a um artigo em tempo real, listando seus detalhes.
 *
 * @param {string} artigoID - O ID do artigo para o qual os comentários devem ser exibidos.
 * @returns {void} Esta função não retorna diretamente, mas manipula a saída dos comentários.
 *
 * @description Esta função utiliza o Firestore para monitorar em tempo real as alterações nos comentários relacionados
 * ao artigo especificado. Os comentários são filtrados por status "on" e ordenados por data. Os dados de autor são
 * buscados de forma assíncrona para enriquecer a exibição dos comentários. Em caso de erro ao obter o autor,
 * uma mensagem apropriada é exibida.
 */
function verComentariosLista(artigoID) {
    let out = '';
    db.collection("comentarios")
        .where("artigo", "==", artigoID)
        .where("status", "==", "on")
        .orderBy("data")
        .onSnapshot(async (querySnapshot) => {
            if (!querySnapshot.empty) {
                if (querySnapshot.size > 1) {
                    out = `<p class="conta">${querySnapshot.size} comentários.</p>`;
                } else {
                    out = `<p class="conta">1 comentário.</p>`;
                }

                for (const doc of querySnapshot.docs) {
                    const comentario = doc.data();
                    try {
                        const autor = await getUser(comentario.autor);
                        comentario['dataBr'] = dataISOparaBR(comentario.data);

                        out += `
                                <div class="comentario">
                                    <small>Por ${autor.nome} em ${comentario.dataBr}.</small>
                                    <div>${comentario.comentario}</div>
                                </div>
                            `;
                    } catch (error) {
                        console.error("Erro ao obter autor: ", error);
                        out += `
                                <div class="comentario">
                                    <small>Autor não encontrado em ${comentario.dataBr}.</small>
                                    <div>${comentario.comentario}</div>
                                </div>
                            `;
                    }
                }
            } else {
                out = `<p>Nenhum comentário! Seja o primeiro a comentar...</p>`;
            }
            return out;
        });
}


/**
 * Gera o template HTML para a estrutura básica da página.
 * 
 * @returns {string} O template HTML da página.
 * 
 * Exemplos de uso:
 *     let html = template(); // Retorna o template HTML completo
 */
function template() {
    const out = `
<header>
    <div>
        <a href="/"><img src="${site.logo}" alt="Logotipo do ${site.nome}"></a>
        <h1>${site.nome}</h1>
    </div>
    <form action="procura.html" method="get">
        <input type="search" name="q" placeholder="Pesquisar...">
        <button type="submit"><i class="fa-solid fa-magnifying-glass fa-fw"></i></button>
    </form>
</header>

<nav>
    <a href="/" title="Página inicial"><i class="fa-solid fa-house fa-fw"></i><span>Início</span></a>
    <a href="contatos.html" title="Faça contato conosco"><i class="fa-solid fa-comments fa-fw"></i><span>Contatos</span></a>
    <a href="sobre.html" title="Sobre o site e o autor"><i class="fa-solid fa-circle-info fa-fw"></i><span>Sobre</span></a>
    <a href="login.html" id="usuarioAcao" title="Logue-se no site"><img src="img/anonimo.png" alt="Faça login" referrerpolicy="no-referrer"><span>Login</span></a>
</nav>

<main id="conteudo"></main>

<footer>
    <a href="/" title="Ir para a página inicial."><i class="fa-solid fa-house fa-fw"></i></a>
    <div>
        <i class="fa-regular fa-copyright fa-rotate-180 fa-fw"></i>
        <span>Copyleft 2025 Joca da Silva</span>
        <div><a href="privacidade.html">Políticas de Privacidade</a></div>
    </div>
    <a href="#wrap" title="Ir para o começo desta página."><i class="fa-solid fa-circle-up fa-fw"></i></a>
</footer>
    `;
    return out;
}

