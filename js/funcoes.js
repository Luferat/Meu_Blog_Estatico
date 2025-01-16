function _(seletor) {
    if (seletor.startsWith('#') || seletor.startsWith('.') || seletor.includes(' ')) {
        const resultado = document.querySelectorAll(seletor);
        return resultado.length === 1 ? resultado[0] : resultado;
    }
    return document.querySelectorAll(seletor);
}

function template() {
    out = `
<header>
    <div>
        <a href="index.html"><img src="${site.logo}" alt="Logotipo do ${site.nome}"></a>
        <h1>${site.nome}</h1>
    </div>
    <form action="procura.html" method="get">
        <input type="search" name="q" placeholder="Pesquisar...">
        <button type="submit"><i class="fa-solid fa-magnifying-glass fa-fw"></i></button>
    </form>
</header>

<nav>
    <a href="index.html" title="Página incial"><i class="fa-solid fa-house fa-fw"></i><span>Início</span></a>
    <a href="contatos.html" title="Faça contato conosco"><i class="fa-solid fa-comments fa-fw"></i><span>Contatos</span></a>
    <a href="sobre.html" title="Sobre o site e o autor"><i class="fa-solid fa-circle-info fa-fw"></i><span>Sobre</span></a>
    <a href="login.html" id="interacaoUsuario" title="Logue-se no site"><img src="img/anonimous.png" alt="Faça login"><span>Login</span></a>
</nav>

<main id="conteudo"></main>

<footer>
    <a href="index.html" title="Ir para a página inicial."><i class="fa-solid fa-house fa-fw"></i></a>
    <div>
        <i class="fa-regular fa-copyright fa-rotate-180 fa-fw"></i>
        <span>Copyleft 2025 Joca da Silva</span>
        <div><a href="privacidade.html">Políticas de Privacidade</a></div>
    </div>
    <a href="#wrap" title="ir para o começo desta página."><i class="fa-solid fa-circle-up fa-fw"></i></a>
</footer>
    `;
    return out;
}