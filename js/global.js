

// Arrow function
window.onload = () => {

    document.title = site.nome;

    // Carrega o template HTML em div#wrap
    _('#wrap').innerHTML = template();

    _('#conteudo').innerHTML = 'Estou com fome!!!'

}