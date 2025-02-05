/**
 * Obter o valor do parâmetro "artigo" (ID do artigo) da URL.
 **/
const urlParams = new URLSearchParams(window.location.search);
const artigoId = urlParams.get('artigo');

// console.log(artigoId);

// Obtém o artigo pelo ID
db.collection("artigos")
    .doc(artigoId)
    .onSnapshot(async (doc) => {
        if (doc.exists) {
            // Se o artigo foi encontrado

            const artigo = doc.data(); // Extrai os dados
            artigo['id'] = doc.id; // Extrai o ID
            const data = dataISOparaBR(artigo.data); // Converte a data para BR

            // Título do documento
            document.title = `${site.nome} - ${artigo.titulo}`;

            // Monta o HTML de saída
            let out = `
                <h2>${artigo.titulo}</h2>
                <small>Em ${data}.</small>
                <div>${artigo.conteudo}</div>
            `;

            // Se comentários estão ativos para este artigo...
            if (artigo.comentarios == 'on') {

                // Inclui elementos de comentário no HTML
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
                        out = '<p><span id="spanLogin" onclick="fbSigIn()">Logue-se</span> usando sua conta Google para comentar!</p>';
                    }
                    _('#formComentario').innerHTML = out;
                    // Monitora envio do formulário de comentário
                    if (_('#comentarioForm').length > 0)
                        _('#comentarioForm').addEventListener('submit', enviaFormComentario);
                });
            }

            _('#conteudo').innerHTML = out;

        } else {
            location.href = '404.html';
        }
    });

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
        listaTags = `<span class="help" title=" Tags HTML permitidas: ` + listaTags.slice(0, -2) + `"><i class="fa-solid fa-circle-question fa-fw"></i></span>`;
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
 * Processa o envio do formulário de comentário.
 * @param {Event} ev - O evento de envio do formulário.
 * @returns {boolean} - Retorna false se o comentário estiver vazio.
 */
function enviaFormComentario(ev) {
    ev.preventDefault(); // Previne o comportamento padrão do formulário.

    // Remove tags não permitidas do comentário.
    const txtComentario = stripTags(this.txtComentario.value, site.tagsPermitidasComentario, true);

    // Verifica se o comentário está vazio após a remoção das tags.
    if (txtComentario === '') return false;

    // Cria um objeto com os dados do formulário.
    const form = {
        artigo: this.artigo.value, // ID do artigo relacionado ao comentário.
        autor: this.autor.value, // Nome do autor do comentário.
        comentario: txtComentario, // Conteúdo do comentário.
        data: agoraISO(), // Data atual no formato ISO.
        status: 'on' // Status do comentário.
    };

    // Reseta o formulário após a coleta dos dados.
    this.reset();

    // Adiciona os dados do formulário à coleção 'comentarios' no Firestore.
    db.collection("comentarios").add(form)
        .then(() => {
            // Exibe uma mensagem de sucesso.
            showDialog(`<p>Comentário enviado com sucesso!</p>`);
        })
        .catch((error) => {
            // Exibe uma mensagem de erro e loga o erro no console.
            showDialog(`<p>Falha ao enviar comentário. Tente mais tarde!</p>`);
            console.error(error);
        });
}