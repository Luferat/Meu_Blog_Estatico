/***********************************************
 * Nome do Arquivo: funcoes.js
 * Descrição: Biblioteca de funções JavaScript de uso geral.
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
 **/
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
 **/
function agoraISO() {
    const agora = new Date();
    return formatarData(agora, 'ISO');
}

/**
 * Converte uma data do formato ISO para o formato BR.
 * @param {string} dataISO - A data no formato ISO (YYYY-MM-DD HH:MM:SS).
 * @returns {string} A data no formato BR (DD/MM/YYYY HH:MM).
 **/
function dataISOparaBR(dataISO) {
    const data = new Date(dataISO);
    return formatarData(data, 'BR');
}

/**
 * Converte uma data do formato JavaScript (GMT) para o formato ISO.
 * @param {Date} dataJS - A data no formato JavaScript.
 * @returns {string} A data no formato ISO (YYYY-MM-DD HH:MM:SS).
 **/
function dataJStoISO(dataJS) {
    const data = new Date(dataJS);
    return formatarData(data, 'ISO');
}

/**
 * Retorna o "Node" de um elemento ou a "NodeList" de uma coleção de elementos usando o seletor especificado.
 * 
 * @param {string} seletor O seletor CSS do(s) elemento(s) a ser(em) selecionado(s).
 * @returns {Node|NodeList} O "Node" do elemento se houver apenas um, ou a "NodeList" dos elementos correspondentes.
 * 
 * Exemplos de uso:
 *     Selecionar por ID: let el = _('#meuID'); // Retorna o elemento com o id especificado
 *     Selecionar por classe: let el = _('.minhaClasse'); // Retorna todos os elementos com a classe "minhaClasse"
 *     Selecionar por tag (ou seletores mais complexos): let el = _('div > p'); // Retorna todos os <p> dentro de <div>
 *     Selecionar elemento por tag: let el = _('i'); // Retorna todos os elementos <i>
 **/
function _(seletor) {
    if (seletor.startsWith('#') || seletor.startsWith('.') || seletor.includes(' ')) {
        const resultado = document.querySelectorAll(seletor);
        return resultado.length === 1 ? resultado[0] : resultado;
    }
    return document.querySelectorAll(seletor);
}

/**
 * Login no Firebase Authentication
 */
function fbSigIn() {
    firebase.auth().signInWithPopup(provider);
}

/**
 * Logout do Firebase
 */
function fbSignOut() {
    firebase.auth().signOut();
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
 * Trata a ação do usuário com base em eventos de clique em elementos monitorados.
 * @param {Event} evento - Evento disparado ao clicar no botão do usuário.
 */
function usuarioAcao(evento) {
    // Bloqueia a execução normal do evento
    evento.preventDefault();

    // Obtém a ação do botão do usuário do atributo `data-acao`.
    const acao = _('#usuarioAcao').getAttribute('data-acao');

    // Seleciona a ação conforme `data-acao`
    switch (acao) {
        case 'login':
            fbSigIn();
            break;
        case 'logout':
            fbSignOut();
            break;
        case 'perfil':
            location.href = 'perfil.html';
            break;
        default:
            console.warn(`Ação desconhecida: ${acao}`);
    }
}

/**
 * Carrega um template HTML e insere seu conteúdo na página,
 * realizando substituições dinâmicas com informações do site.
 * @param {string} templateHTML - Caminho para o arquivo HTML do template.
 */
function template(templateHTML) {
    fetch(templateHTML)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Realiza substituições dinâmicas no template
            let updatedHTML = html
                .replace('{{site.logo}}', site.logo)
                .replace('{{site.nome}}', site.nome)
                .replace('{{site.licensa}}', site.licensa);

            // Carrega o template HTML em div#wrap
            _('#wrap').innerHTML = updatedHTML;

            // Monitora cliques no botão do usuário
            _('#usuarioAcao').addEventListener('click', usuarioAcao);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}
