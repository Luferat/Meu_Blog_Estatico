document.title = `${site.nome} - Página modelo`;

_('#wrap').innerHTML = template();

out = `

<h2>Página Modelo</h2>
<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga ducimus ab minus excepturi repellendus et molestias suscipit recusandae, est aliquam reiciendis laborum. In dolorem, obcaecati iste saepe iusto harum cupiditate!</p>
<img src="https://picsum.photos/200/100" alt="Imagem aleatória">
<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi natus eveniet consequuntur, illum, minima repudiandae id dolorem porro, a perferendis soluta! Dolorem eaque dolor sapiente optio beatae. Expedita, sed voluptas!</p>
<ul>
    <li>Lorem ipsum</li>
    <li>Similique quasi</li>
    <li>Fuga ducimus ab minus</li>
</ul>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique quasi at ea error, alias tenetur dolor voluptas voluptatem eligendi provident, rerum ab! Velit ipsum fugit maiores nemo officia ratione veritatis.</p>

`;

_('#conteudo').innerHTML = out;