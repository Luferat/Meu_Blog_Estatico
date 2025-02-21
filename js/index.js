/***********************************************
 * Nome do Arquivo: index.js
 * Descrição: JavaScripts para processamento da página `index.html`.
 * Autor: André Luferat
 * Data de Criação: 13/01/2025
 * Última Modificação: 13/01/2025
 * Versão: 1.0
 ***********************************************/

/**
 * Define o <title> da página.
 **/
document.title = site.nome;

/**
 * Obter lista de artigos.
 *  - Somente artigos com `status = "on"`;
 *  - Somente artigos com `data <= agora`.
 * 
 *     ATENÇÃO! Será necessário gerar um índice no Firestore.artigos.
 *     O link para gerar o índice aparece no console.
 *     Quando o índice estiver pronto, a listagem funcionará.
 **/

db.collection("artigos")
    .where("status", "==", "on") // Filtra pelo status = "on"
    .where("data", "<=", agoraISO()) // Filtra pelas datas no passado ou presente
    .orderBy("data") // Ordena pela data mais recente
    .onSnapshot((querySnapshot) => {

        /**
         * Formata HTML de saída na variável `out`.
         **/
        out = `
            <h2>Artigos Recentes</h2>
            <div class="lista-artigos">
        `;

        /**
         * Obtém cada documento.
         **/
        querySnapshot.forEach((doc) => {
            artigo = doc.data();
            artigo['id'] = doc.id;

            out += `
                <div class="item-artigo" onclick="location.href='ler.html?artigo=${artigo.id}'" title="Clique para ler o artigo completo.">
                    <img src="${artigo.imagem}" alt="${artigo.titulo}">
                    <div>
                        <h3>${artigo.titulo}</h3>
                        <span>${artigo.resumo}</span>
                    </div>
                </div>
            `;
        });

        out += `</div>`;

        /**
         * Exibe a saída no HTML.
         **/
        _('#conteudo').innerHTML = out;
    });