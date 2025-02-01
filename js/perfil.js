

// Observador do Firebase Auth
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        console.log(user);

        // Título da página
        document.title = `${site.nome} - Perfil de ${user.displayName}`;

        telefone = '';
        verificado = 'Não';

        if (user.phoneNumber)
            telefone = `<li><strong>Telefone:</strong> ${user.phoneNumber}</li>`;
        if (user.emailVerified)
            verificado = `Sim`;

        let out = `
        
<h2>Olá ${user.displayName}!</h2>
<img class="fotoPerfil" src="${user.photoURL}" alt="Avatar de ${user.displayName}" referrerpolicy="no-referrer">

<ul class="ulDados">
    <li><strong>E-mail:</strong> ${user.email}</li>
    <li><strong>E-mail verificado:</strong> ${verificado}</li>
    ${telefone}
    <li><strong>ID:</strong> ${user.uid}</li>
    <li><strong>Cadastro:</strong> ${dataISOparaBR(dataJStoISO(user.metadata.creationTime))}</li>
    <li><strong>Último login:</strong> ${dataISOparaBR(dataJStoISO(user.metadata.lastSignInTime))}</li>
</ul>

<p>Clique no botão abaixo para ver/editar seu perfil no Google.</p>
<button class="btnPerfil" type="button" onclick="verPerfil()"><i class="fa-brands fa-google fa-fw"></i> Perfil no Google</button>

<p>Clique no botão abaixo para fazer logout/sair do aplicativo.</p>
<button class="btnLogout" type="button" onclick="fbSignOut()"><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout / Sair</button>

        `;

        // Exibe os dados no HTML
        _('#conteudo').innerHTML = out;

    } else {
        // Se não está logado, mostra 404.html
        location.href = 'index.html';
    }
});

/**
 * Abre o perfil do usuário no Google em um nova guia do navegador.
 */
function verPerfil() {
    window.open('https://myaccount.google.com/', '_blank');
}