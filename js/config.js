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
     * Controla globalmente o sistema de comentários.
     * Se `true`, exibe o sistema de comentários dos artigos.
     * Se `false`, desliga o sistema de comentários dos artigos.
     * 
     * Nota: os comentários em um artigo específico também podem ser 
     * ligados/desligados usando o campo "comentarios" de cada documento.
     **/
    verComentarios: true,
}