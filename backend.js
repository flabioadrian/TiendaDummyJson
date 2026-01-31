const muro = document.getElementById('muro');
const detalles = document.getElementById('detalles');
const cargarMas = document.getElementById('cargarMas');
const categoriasSelect = document.getElementById('categorias');
const buscarProductoInput = document.getElementById('busqueda');
const incremento = 15;
let limiteActual = 15;

obtenerProductos(limiteActual, 0);
cargarCategorias();

function obtenerProductos(limit, skip) {
    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    .then((response) => response.json())
    .then((data) => {
        data.products.forEach((product) => {
            const productoHTML = `
                <div id="prod-${product.id}" onclick="mostrarInfo(${product.id})" class="producto">
                    <h3>${product.title}</h3>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <p><Strong>Precio:</Strong> $${product.price}</p>
                    <p><Strong>Categoría:</Strong> ${product.category}</p>
                    <p><Strong>Rating:</Strong> ${product.rating} /5</p>
                </div>`;
            muro.insertAdjacentHTML('beforeend', productoHTML);
        });
    });
}

function cargarMasProductos() {
    const productosCargados = muro.getElementsByClassName('producto').length;
    if(buscarProductoInput.value === ""){
        if(categoriasSelect.value === "")
            obtenerProductos(incremento, productosCargados);
        else
            cargarCategoria(categoriasSelect.value, incremento, productosCargados);
    } else {
        cargarBusqueda(buscarProductoInput.value, incremento, productosCargados);
    }
};

const mostrarInfo = (id) => {
    window.location.href = `detalles.html?id=${id}`;
};

function cargarCategorias(){
    fetch('https://dummyjson.com/products/category-list')
    .then(res => res.json())
    .then((categorias) => {
        categorias.forEach((categoria) => {
            const option = `<option value='${categoria}'>${categoria}</option>`;
            categoriasSelect.innerHTML += option;
        });
    });
}

function filtrarPorCategoria(){
    buscarProductoInput.value = "";
    if(categoriasSelect.value === ""){
        muro.innerHTML = '';
        obtenerProductos(limiteActual, 0);
        return;
    }
    muro.innerHTML = '';
    cargarCategoria(categoriasSelect.value);
}

function cargarCategoria(categoria, limit = limiteActual, skip = 0){
    fetch(`https://dummyjson.com/products/category/${categoria}?limit=${limit}&skip=${skip}`)
    .then(res => res.json())
    .then((data) => {
        data.products.forEach((product) => {
            const productoHTML = `
                <div id="prod-${product.id}" onclick="mostrarInfo(${product.id})" class="producto">
                    <h3>${product.title}</h3>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <p><Strong>Precio:</Strong> $${product.price}</p>
                    <p><Strong>Categoría:</Strong> ${product.category}</p>
                    <p><Strong>Rating:</Strong> ${product.rating} /5</p>
                </div>`;
            muro.insertAdjacentHTML('beforeend', productoHTML);
        });
    });
}

function buscarProducto() {
    const busqueda = buscarProductoInput.value;
    muro.innerHTML = '';
    if (busqueda === "") {
        obtenerProductos(limiteActual, 0);
    } else {
        cargarBusqueda(busqueda);
    }
}

function cargarBusqueda(busqueda, limit = limiteActual, skip = 0) {
    fetch(`https://dummyjson.com/products/search?q=${busqueda}&limit=${limit}&skip=${skip}`)
    .then(res => res.json())
    .then((data) => {
        data.products.forEach((product) => {
            const productoHTML = `
                <div id="prod-${product.id}" onclick="mostrarInfo(${product.id})" class="producto">
                    <h3>${product.title}</h3>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <p><Strong>Precio:</Strong> $${product.price}</p>
                    <p><Strong>Categoría:</Strong> ${product.category}</p>
                    <p><Strong>Rating:</Strong> ${product.rating} /5</p>
                </div>`;
            muro.insertAdjacentHTML('beforeend', productoHTML);
        });
    })
    .catch(err => alert("Error en la búsqueda:", err));
}

function resetearFiltros() {
    categoriasSelect.value = "";
    categoriasSelect.selectedIndex = 0;
}