window.onload = () => cargarVista(localStorage.getItem('vista') || 'inicio');   //Usamos el localStorage


// Mapa vista → JS a cargar
const modulos = {
    inicio: null,
    //html: 'js',
    clientes: 'clientes',  
    jugadores: 'jugadores',
    categorias: 'categorias',
    domicilios: 'domicilios',
    computadora: 'computadora'
};


async function cargarVista(vista) {


    localStorage.setItem('vista', vista);


    const res = await fetch(`/views/${vista}.html`);
    const html = await res.text();


    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = html;


    // Eliminar scripts anteriores
    document.querySelectorAll('script[data-modulo]').forEach(s => s.remove());


    const modulo = modulos[vista];
    if (!modulo) return;


    const script = document.createElement('script');
    script.src = `/js/${modulo}.js`;
    script.defer = true;
    script.dataset.modulo = modulo;


    contenedor.appendChild(script);
}


