/**
 * Deine o <title> padrão da página atual.
 **/
document.title = site.nome;

db.collection("artigos")
    .where("status", "==", "on")
    .where("data", "<=", agoraISO())
    .orderBy("data", "desc")
    .get()
    .then((querySnapshot) => {
        /**
         * Formata HTML de saída na variável `out`.
         **/
        out = `
            <h2>Artigos Recentes</h2>
            <div class="lista-artigos">
        `;
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            artigo = doc.data();
            artigo['id'] = doc.id;
            //console.log(artigo);

            // Monta o HTML de cada um dos artigos
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

        out += '</div>';

        _('#conteudo').innerHTML = out;
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });