/**
 * Define o título da página com o nome do site e a seção atual.
 */
document.title = `${site.nome} - Sobre`;

/**
 * Variável `out` contém o HTML do conteúdo da página "Sobre".
 * Este conteúdo será inserido dinamicamente na página.
 */
out = `
<h2>Sobre</h2>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolores atque ab unde velit rem libero perspiciatis quo consequuntur ea nesciunt consectetur a sed, nemo qui deleniti ipsa magni odit.</p>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolores atque ab unde velit rem libero perspiciatis quo consequuntur ea nesciunt consectetur a sed, nemo qui deleniti ipsa magni odit.</p>
<img src="https://picsum.photos/300/200" alt="Imagem aleatória" style="display: block; margin: 0 auto; width:auto; max-width: 100%;">
<small style="display: block; text-align: center;">Imagem aleatória.</small>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolores atque ab unde velit rem libero perspiciatis quo consequuntur ea nesciunt consectetur a sed, nemo qui deleniti ipsa magni odit.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolores atque ab unde velit rem libero perspiciatis quo consequuntur ea nesciunt consectetur a sed, nemo qui deleniti ipsa magni odit.</p>
`;

/**
 * Observa mudanças no estado de autenticação do Firebase.
 * Insere o conteúdo da página "Sobre" no elemento com id "conteudo".
 * @param {Object} user - O objeto de usuário autenticado do Firebase.
 */
firebase.auth().onAuthStateChanged(() => {
    _("#conteudo").innerHTML = out; // Insere o conteúdo na página.
});
