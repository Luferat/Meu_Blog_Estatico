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

// Processa envio do formulário
_('#comentarioForm').onsubmit = (ev) => {
    ev.
    console.log()
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
                            out = '<p>LOGIN AQUI...</p>';
                        }
                        _('#formComentario').innerHTML = out;
                    });
                }

                _('#conteudo').innerHTML = out;
            } else {
                location.href = '404.html';
            }
        });
}

function montaForm(user, artigo) {
    return `
    <div class="quem">Comentando como ${user.displayName}:</div>
    <form method="post" name="formComentario" id="comentarioForm" action="/">
        <textarea name="txtComentario" id="txtComentario" placeholder="Comente aqui..."></textarea>
        <button type="submit">Enviar</button>
        <input type="hidden" name="artigo" value="${artigo.id}">
        <input type="hidden" mane="autor" value="${user.uid}">
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
                    }
                }
            } else {
                out = `<p>Nenhum comentário! Seja o primeiro a comentar...</p>`;
            }
            _('#listaComentarios').innerHTML = out;
        });
}





