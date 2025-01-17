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

/**
 * Obtém o artigo do Firebase.
 **/
db.collection("artigos")
    .doc(artigoId)
    .onSnapshot((doc) => {
        if (doc.exists) {
            const artigo = doc.data();
            artigo['id'] = doc.id;
            const data = dataISOparaBR(artigo.data);

            out = `
                <h2>${artigo.titulo}</h2>
                <small>Em ${data}.</small>
                <div>${artigo.conteudo}</div>

                <h3>Comentários</h3>
                <div id="formComentarios"></div>
                <div id="listaComentarios"></div>
            `;

            _('#conteudo').innerHTML = out;
            if (site.verComentarios) comentarios();

            db.collection("comentarios")
                .where("artigo", "==", artigo.id)
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

                    _('#listaComentarios').innerHTML = out;
                });


        } else {
            location.href = '404.html';
        }
    });