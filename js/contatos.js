/***********************************************
 * Nome do Arquivo: contatos.js
 * Descrição: JavaScripts para processamento da página `contatos.html`.
 * Autor: André Luferat
 * Data de Criação: 13/01/2025
 * Última Modificação: 13/01/2025
 * Versão: 1.0
 ***********************************************/

/**
 * Define o <title> da página com o nome do site e a seção atual.
 **/
document.title = `${site.nome} - Contatos`;

/**
 * Variável `out` contém o HTML do formulário de contato.
 * Este formulário será inserido dinamicamente na página.
 **/
out = `
<h2>Faça Contato</h2>

<form id="form-contato">

    <p>Preencha todos os campos abaixo para entrar em contato conosco.</p>

    <p>
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" required minlength="3">
    </p>

    <p>
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required>
    </p>

    <p>
        <label for="assunto">Assunto:</label>
        <input type="text" id="assunto" name="assunto" required minlength="3">
    </p>

    <p>
        <label for="mensagem">Mensagem:</label>
        <textarea id="mensagem" name="mensagem" required minlength="5"></textarea>
    </p>

    <p>
        <button type="submit">Enviar</button>
    </p>

</form>
`;

/**
 * Função `enviaForm` é chamada quando o formulário é enviado.
 * Esta função coleta os dados do formulário e os envia para o Firestore.
 * @param {Event} event - O evento de envio do formulário.
 **/
function enviaForm(event) {
    // Previne o comportamento padrão do formulário.
    event.preventDefault();

    // Coleta os dados do formulário.
    const FormData = {
        nome: _('#nome').value,
        email: _('#email').value,
        assunto: _('#assunto').value,
        mensagem: _('#mensagem').value,
        data: agoraISO(), // Obtém a data atual no formato ISO.
        status: 'on'
    };

    // Adiciona os dados do formulário à coleção 'contatos' no Firestore.
    db.collection('contatos').add(FormData)
        .then(() => {
            // Exibe uma mensagem de sucesso e limpa o formulário.
            showDialog(`<p>Contato enviado com sucesso!</p>`);
            _('#assunto').value = '';
            _('#mensagem').value = '';
        })
        .catch((erro) => {
            // Exibe uma mensagem de erro e loga o erro no console.
            showDialog(`<p>Falha ao enviar comentário. Tente mais tarde!</p>`);
            console.error(erro);
        });

    // Exibe o diálogo de feedback.
    // _('#dialog').showModal();
}

/**
 * Observa mudanças no estado de autenticação do Firebase.
 * Se o usuário estiver autenticado, preenche os campos de nome e email.
 * Caso contrário, limpa os campos de nome e email.
 **/
firebase.auth().onAuthStateChanged((user) => {
    _("#conteudo").innerHTML = out; // Insere o formulário na página.
    if (user) {
        _('#nome').value = user.displayName; // Preenche o campo nome.
        _('#email').value = user.email; // Preenche o campo email.
    }
    _('#form-contato').addEventListener('submit', enviaForm); // Adiciona o evento de envio ao formulário.
});
