/**
 * Configurações iniciais do site.
 **/
const site = {

    /**
     * Nome do site usado na tag <title>...</title> e nas interações dinâmicas
     **/
    nome: "Meu Blog Estático",

    /**
     * Logotipo do site, usado na tag <header>...</title>
     */
    logo: "img/logo.png",

    /**
     * Controla a ação ao clicar no link do usuário logado no menu principal
     * Se `true`, exibe o perfil do usuário → perfil.html
     * Se `false`, faz logout direto
     **/
    verPerfil: false,

    /**
     * Controla o formulário do sistema de comentários.
     * Se `true`, exibe o formulário do sistema de comentários do artigo.
     * Se `false`, desliga o formulário do sistema de comentários do artigo.
     **/
    verComentariosForm: true,
}