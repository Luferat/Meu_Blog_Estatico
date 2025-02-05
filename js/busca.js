// Define o título da página com o nome do site e a seção atual
document.title = `${site.nome} - Busca`;

// Obtém a query string da URL
const params = new URLSearchParams(window.location.search);

// Captura o valor do parâmetro "q" e remove espaços em branco no início e no fim
const searchTerm = params.get("q") ? params.get("q").trim() : "";

// Função para buscar artigos no Firestore
async function searchArticles(term) {
    const querySnapshot = await db.collection("artigos")
        .where("status", "==", "on")
        .where("data", "<=", agoraISO())
        .orderBy("data")
        .get();

    const results = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        data['id'] = doc.id;
        // Verifica se as propriedades 'titulo', 'conteudo' e 'resumo' existem antes de usar 'includes'
        if (
            (data.titulo && data.titulo.includes(term)) ||
            (data.conteudo && data.conteudo.includes(term)) ||
            (data.resumo && data.resumo.includes(term))
        ) {
            results.push(data);
        }
    });

    return results;
}

// Função para lidar com a exibição dos resultados da busca
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

    document.title = `${site.nome} - Busca por "${searchTerm}"`;

    try {
        const searchResult = await searchArticles(searchTerm);

        let out = `
        <h2>Resultados para: ${searchTerm}</h2>
        `;

        _('#searchQ').value = searchTerm;

        if (searchResult.length === 0) {
            out += `
            <p>Nenhum resultado encontrado para: ${searchTerm}</p>
            `;
        } else {
            out += `<p>${searchResult.length} resultado(s) encontrado(s):</p>`;
            out += `<div class="lista-artigos">`;

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

        _('#conteudo').innerHTML = out;
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
    }
}

// Observa mudanças no estado de autenticação do Firebase
firebase.auth().onAuthStateChanged(handleSearch);