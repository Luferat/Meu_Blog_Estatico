/**
 * Pesquisa de artigos
 * ATENÇÃO! NÃO USE EM PRODUÇÃO!
 * Essa é uma versão simplificada do script de busca e não deve ser usada em produção.
 * Esse script baixa TODOS os artigos do Firestore e faz a busca localmente, o que consome mitos recursos banda.
 */

// Define o título da página com o nome do site e a seção atual
document.title = `${site.nome} - Busca`;

// Obtém a query string da URL
const params = new URLSearchParams(window.location.search);

// Captura o valor do parâmetro "q" e remove espaços em branco no início e no fim
const searchTerm = params.get("q") ? params.get("q").trim() : "";

/**
 * Função para buscar artigos no Firestore com base em um termo específico.
 * 
 * @param {string} term - Termo de busca a ser pesquisado nos campos "titulo", "conteudo" e "resumo".
 * @returns {Promise<Array>} - Retorna uma Promise com um array de objetos contendo os artigos encontrados.
 */
async function searchArticles(term) {
    try {
        // Consulta artigos filtrados por status ativo e data válida
        const querySnapshot = await db.collection("artigos")
            .where("status", "==", "on")       // Somente artigos com status "on"
            .where("data", "<=", agoraISO())   // Filtra datas no passado ou presente
            .orderBy("data")                   // Ordena pela data mais recente
            .get();

        // Lista de resultados da busca
        const results = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data['id'] = doc.id;

            // Verifica se o termo aparece nos campos relevantes
            if (
                (data.titulo && data.titulo.includes(term)) ||
                (data.conteudo && data.conteudo.includes(term)) ||
                (data.resumo && data.resumo.includes(term))
            ) {
                results.push(data);
            }
        });

        return results; // Retorna os artigos encontrados

    } catch (error) {
        console.error("Erro ao buscar artigos:", error);
        throw new Error("Falha ao realizar a busca.");
    }
}

/**
 * Função para lidar com a exibição dos resultados da busca.
 * Realiza a busca de artigos no Firestore e atualiza o conteúdo da página.
 * 
 * @async
 */
async function handleSearch() {
    // Verifica se o termo de busca está vazio
    if (!searchTerm) {
        const out = `
        <h2>Pesquisando...</h2>
        <p>Digite algo no formulário de pesquisa.</p>
        `;
        _('#conteudo').innerHTML = out;
        return;
    }

    // Atualiza o título da página com o termo pesquisado
    document.title = `${site.nome} - Busca por "${searchTerm}"`;

    try {
        // Realiza a busca de artigos com o termo fornecido
        const searchResult = await searchArticles(searchTerm);

        let out = `<h2>Resultados para: ${searchTerm}</h2>`;

        // Preenche o campo de pesquisa com o termo buscado
        _('#searchQ').value = searchTerm;

        if (searchResult.length === 0) {
            // Mensagem para caso não haja resultados
            out += `<p>Nenhum resultado encontrado para: ${searchTerm}</p>`;
        } else {
            // Exibe a quantidade de resultados encontrados
            out += `<p>${searchResult.length} resultado(s) encontrado(s):</p>`;
            out += `<div class="lista-artigos">`;

            // Itera pelos resultados e cria os elementos HTML correspondentes
            searchResult.forEach((data) => {
                out += `
                <div class="item-artigo" onclick="location.href='ler.html?artigo=${data.id}'" title="Clique para ler o artigo completo.">
                    <img src="${data.imagem}" alt="${data.titulo}">
                    <div>
                        <h3>${data.titulo}</h3>
                        <span>${data.resumo}</span>
                    </div>
                </div>
                `;
            });

            out += `</div>`;
        }

        // Insere o conteúdo gerado no contêiner principal da página
        _('#conteudo').innerHTML = out;

    } catch (error) {
        // Captura e exibe erros durante a busca
        console.error('Erro ao buscar artigos:', error);
    }
}


// Observa mudanças no estado de autenticação do Firebase
firebase.auth().onAuthStateChanged(handleSearch);