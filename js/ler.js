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
            `;

            if (artigo.comentarios == "on") {
                out += verComentariosForm();
                out += verComentariosLista(artigo.id);
            }

            _('#conteudo').innerHTML = out;
        } else {
            location.href = '404.html';
        }
    });
