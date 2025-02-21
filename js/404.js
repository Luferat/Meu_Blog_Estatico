
document.title = `${site.nome} - Erro 404`


setTimeout(()=>{


    _('#conteudo').innerHTML = `

<h2>Oooops!</h2>

<p>O conteúdo que você está tentando acessar, não existe...</p>

<img class="imgErro404" src="img/erro404.jpg" alt="Erro 404">

    
    `;
    
}, 300);


