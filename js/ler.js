/***********************************************
 * Nome do Arquivo: ler.js
 * Descrição: JavaScripts para processamento da página `ler.html`.
 * Autor: André Luferat
 * Data de Criação: 13/01/2025
 * Última Modificação: 13/01/2025
 * Versão: 1.0
 * Nota: ATENÇÃO! Será necessário gerar um índice no Firestore.comentarios.
 *       O link para gerar o índice aparece no console.
 *       Quando o índice estiver pronto, a listagem de comentários funcionará.
 ***********************************************/

/**
 * Carrega o template da página.
 **/
_('#wrap').innerHTML = template();

/**
 * Obter o valor do parâmetro "artigo" (ID do artigo) da URL.
 **/
const urlParams = new URLSearchParams(window.location.search);
const artigoId = urlParams.get('artigo');

// Obtém o artigo completo
pegaArtigoCompleto(artigoId);

/**
 * Processa o envio do formulário.
 * @param {Event} ev 
 * @returns 
 */
function enviaForm(ev) {
    ev.preventDefault();
    txtComentario = stripTags(this.txtComentario.value, site.tagsPermitidasComentario, true);
    if (txtComentario == '') return false;
    let form = {
        artigo: this.artigo.value,
        autor: this.autor.value,
        comentario: txtComentario,
        data: agoraISO(),
        status: 'on'
    }
    db.collection("comentarios").add(form);
}

/**
 * Obtém o artigo do Firebase.
 * @param {string} artigoId
 **/
function pegaArtigoCompleto(artigoId) {
    db.collection("artigos")
        .doc(artigoId)
        .onSnapshot(async (doc) => {
            if (doc.exists) {
                const artigo = doc.data();
                artigo['id'] = doc.id;
                const data = dataISOparaBR(artigo.data);

                let out = `
                    <h2>${artigo.titulo}</h2>
                    <small>Em ${data}.</small>
                    <div>${artigo.conteudo}</div>
                `;

                // Se comentários estão ativos...
                if (artigo.comentarios == 'on') {

                    // Elementos de comentário
                    out += `
                        <h3>Comentários</h3>
                        <div id="formComentario"></div>
                        <div id="listaComentarios"></div>                    
                    `;

                    // Obtém lista de comentários
                    listaComentarios(artigo.id);

                    /**
                     * Exibe o formulário de contatos se o usuário estiver logado.
                     * Se o usuário fizer login/logout, o formulário é exibido/oculto em tempo real.
                     */
                    firebase.auth().onAuthStateChanged((user) => {
                        let out = '';
                        if (user) {
                            out = montaForm(user, artigo);
                        } else {
                            out = '<p>Logue-se usando sua conta Google para comentar!</p>';
                        }
                        _('#formComentario').innerHTML = out;

                        // Monitora envio do formulário de comentário
                        if (_('#comentarioForm').length > 0)
                            _('#comentarioForm').addEventListener('submit', enviaForm);
                    });
                }

                _('#conteudo').innerHTML = out;
            } else {
                location.href = '404.html';
            }
        });
}

/**
 * Monta o formulário de comentário
 * @param {Object} user 
 * @param {Object} artigo 
 * @returns 
 */
function montaForm(user, artigo) {
    let listaTags = '';
    if (site.tagsPermitidasComentario.length > 0) {
        site.tagsPermitidasComentario.forEach((tag) => {
            listaTags += `<${tag}>, `;
        });
        listaTags = `<span class="help" title=" Tags HTML permitidas: ` + listaTags.slice(0, -2) + `">?</span>`;
    }
    return `
    <div class="quem">Comentando como <em>${user.displayName}</em>: ${listaTags}</div>
    <form method="post" name="formComentario" id="comentarioForm" action="/">
        <input type="hidden" name="artigo" value="${artigo.id}">
        <input type="hidden" name="autor" value="${user.uid}">
        <textarea name="txtComentario" id="txtComentario" placeholder="Comente aqui..."></textarea>
        <button type="submit">Enviar</button>
    </form>
    `;
}

/**
 * Obtém a lista de comentários para o artido
 * @param {string} artigoId 
 **/
function listaComentarios(artigoId) {
    db.collection("comentarios")
        .where("artigo", "==", artigoId)
        .where("status", "==", "on")
        .orderBy("data")
        .onSnapshot(async (querySnapshot) => {
            let out = '';
            if (!querySnapshot.empty) {
                if (querySnapshot.size > 1) {
                    out = `<h4 class="conta">${querySnapshot.size} comentários:</h4>`;
                } else {
                    out = `<h4 class="conta">1 comentário:</h4>`;
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
                    }
                }
            } else {
                out = `<h4 class="conta">Nenhum comentário! Seja o primeiro a comentar...</h4>`;
            }
            _('#listaComentarios').innerHTML = out;
        });
}





