/**
 * Obter o valor do parâmetro "artigo" (ID do artigo) da URL.
 **/
const urlParams = new URLSearchParams(window.location.search);
const artigoId = urlParams.get('artigo');

console.log(artigoId);


// Solicita este artigo (pelo id) ao Firestore
db.collection("artigos")
    .doc(artigoId)
    .onSnapshot(async (doc) => {
        if (doc.exists) {
            // Se foi encontrado
            console.log(doc.data())

            // Extrai os dados do artigo
            let artigo = doc.data();

            // Atualiza o title do documento
            document.title = `${site.nome} - ${artigo.titulo}`;

            // Monta a view
            let out = `
            
<h2>${artigo.titulo}</h2>
<small>Em ${dataISOparaBR(artigo.data)}.</small>
${artigo.conteudo}
            
            `;

            // Exibe na página
            _('#conteudo').innerHTML = out;

        } else {
            // Se o artigo não foi encontrado, mostra 404.html
            location.href = '404.html';
        }
    });