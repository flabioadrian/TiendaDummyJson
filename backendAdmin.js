const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');
const productName = params.get('name');
const productPrice = params.get('price');
const productCategory = params.get('category');
let productRating = params.get('rating');
let productThumbnail = params.get('thumbnail');

const muro = document.getElementById('muro');
const categoriasSelect = document.getElementById('categorias');
const buscarProductoInput = document.getElementById('busqueda');
const main = document.getElementById('main');
const selector = document.getElementById('ordenarPor');
const paginacion = document.getElementById("paginaActual");
const incremento = 10;
let paginaActual = 1;
let limiteActual = 10;

let contenidoGuardado = null;

let productoActualizado;

const cargarProductos = (filtros = {}, limit = limiteActual, skip = 0) => {
    let url = `https://dummyjson.com/products`;
    if (filtros.busqueda) {
        url += `/search?q=${filtros.busqueda}`;
    } else if (filtros.categoria) {
        url += `/category/${filtros.categoria}`;
    }
    const conector = url.includes('?') ? '&' : '?';
    url += `${conector}limit=${limit}&skip=${skip}`;

    if (filtros.ordenar) {
        url += `&sortBy=${filtros.ordenar.campo}&order=${filtros.ordenar.tipo}`;
    }

    fetch(url)
        .then(res => res.json())
        .then((data) => {
            let totalPaginas = Math.ceil(data.total / limit);
            if (paginaActual > totalPaginas) {
                paginaActual = totalPaginas;
                return;
            }
            muro.innerHTML = '';
            data.products.forEach(product => {
                let producto = cargarProducto(product);
                if(product.id == productoId) producto = productoActualizado;
                muro.insertAdjacentHTML('beforeend', producto);
            });
            actualizarControlesPaginacion(totalPaginas);
    });
}

if(productoId){
    productoActualizado = cargarProducto({
        id: productoId,
        title : productName,
        price : productPrice,
        category: productCategory,
        rating: productRating,
        thumbnail : productThumbnail
    });
}
cargarProductos();
cargarCategoriasSelct();

function actualizarPagina(cambio){
    const nuevaPagina = paginaActual + cambio;
    if (nuevaPagina < 1) return;

    paginaActual = nuevaPagina;
    let skip = (paginaActual - 1) * limiteActual;
    cargarProductos(crearPaqueteDeBusqueda(), limiteActual, skip)
}

function filtrarPorCategoria(){
    buscarProductoInput.value = "";
    if(categoriasSelect.value === "") cargarProductos()
    else handlerLoaderSearch()
}

function handlerLoaderSearch(){
    selector.selectedIndex = 0
    aplicarOrdenamiento()
}

function aplicarOrdenamiento() {
    paginaActual = 1;
    const paquete = crearPaqueteDeBusqueda();

    cargarProductos(paquete, limiteActual);
}

function crearPaqueteDeBusqueda(){
    let opcionesOrden = null;

    if (selector.value) {
        const [campo, tipo] = selector.value.split('-');
        opcionesOrden = { campo: campo, tipo: tipo };
    }

    return {
        ordenar: opcionesOrden,
        busqueda: buscarProductoInput.value,
        categoria: categoriasSelect.value
    };
}

function actualizarControlesPaginacion(totalPaginas){
    paginacion.innerText = "";
    paginacion.innerText = `${paginaActual} / ${totalPaginas}`;
}

function cargarCategoriasSelct(targetId = 'categorias', selectedValue = null){
    const selectElement = document.getElementById(targetId);
    if(!selectElement) return;

    fetch('https://dummyjson.com/products/category-list')
    .then(res => res.json())
    .then((categorias) => {
        categorias.forEach((categoria) => {
            const isSelected = categoria === selectedValue ? 'selected' : '';
            const option = `<option value="${categoria}" ${isSelected}>${categoria}</option>`;
            selectElement.innerHTML += option;
        });
    });
}

async function editar(id) {
    main.innerHTML = '';
    const producto = await cargarInfo(id);
    cargarCategoriasSelct('categoriasEdit', producto.category);
}

function resetearFiltros() {
    categoriasSelect.value = "";
    categoriasSelect.selectedIndex = 0;
}

async function cargarInfo(id){
    return fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(producto => {
            main.innerHTML = cargarFormulario(producto);
            productThumbnail = producto.thumbnail;
            productRating = producto.rating;
            return producto;
        })
    .catch(err => alert("Error al obtener el producto:", err));
}

function cargarFormulario(producto = null) {
    return `<div id="formulario" class="formulario">
        <label for="productName">Nombre del Producto:</label><br>
        <input type="text" id="productName" name="productName" placeholder="${producto.title}" value="${producto.title}"required><br><br>

        <label for="productPrice">Precio:</label><br>
        <input type="number" id="productPrice" name="productPrice" placeholder="${producto.price}" value="${producto.price}" step="0.01" min="0"><br><br>
        <label for="categoriasEdit">Categoría:</label><br>
        <select id="categoriasEdit"><option value="" selected>Seleccione un producto</option></select><br><br>

        <label for="productdescription">Descripción:</label><br>
        <input type="text" id="productdescription" name="productdescription" placeholder="${producto.description}" value="${producto.description}" required><br><br>

        <button onclick="guardarCambios(${producto.id})" class="botonPrincipal">Guardar Cambios</button>
        <button onclick="cancelar()" class="botonSecundario">Cancelar</button>
        <div id="mensaje" class="mensajePrincipal" style="display: none;"></div>
    </div>
    `;
}

function guardarCambios(id){
    if (!id) {
        alert("No se proporcionó un ID válido");
        return;
    }
    const nombre = document.getElementById('productName').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const categoria = document.getElementById('categoriasEdit').value;
    const descripcion = document.getElementById('productdescription').value;
    const mensajeExito = document.getElementById('mensaje');

    mensajeExito.style.display = 'block';

    if(!nombre || !categoria || isNaN(precio) || !descripcion) {
        mensajeExito.style.display = 'block';
        mensajeExito.style.background = 'red';
        mensajeExito.style.color = 'white';
        mensajeExito.innerText = "Por favor, complete todos los campos correctamente.";
        return;
    };

    const producto = {
        title: nombre,
        price: precio,
        category: categoria,
        description: descripcion,
        thumbnail: 'https://dummyjson.com/image/400x200?type=webp&text='+ nombre
    };
    
    fetch(`https://dummyjson.com/products/${id}`, {
    method: 'PUT', /* or PATCH */
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
    })
    .then(res => res.json())
    .then(data => {
        if(data.id){
            mensajeExito.style.display = 'block';
            mensajeExito.style.background = 'green';
            mensajeExito.style.color = 'white';
            mensajeExito.innerText = "Producto actualizado con éxito. Redirigiendo...";
            setTimeout(() => {
                const params = new URLSearchParams();
                params.append('id', id);
                params.append('thumbnail', productThumbnail)
                params.append('name', nombre);
                params.append('price', precio);
                params.append('category', categoria);
                params.append('rating', productRating)
                window.location.href = `dashBoardAdmin.html?${params.toString()}`; 
            }, 2000);
        }
        else {
            mensajeExito.style.display = 'block';
            mensajeExito.style.background = 'red';
            mensajeExito.style.color = 'white';
            mensajeExito.innerText = "Error al actualizar"
        };
    });
}

function cargarProducto(product){
    const productoHTML = `
                <div id="prod-${product.id}" class="productoListado">
                    <div class="contenedor-imagen">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>
                    <div class="info-producto">
                        <h3>${product.title}</h3>
                        <p><strong>Precio:</strong> $${product.price}</p>
                        <p><strong>Categoría:</strong> ${product.category}</p>
                        <p><strong>Rating:</strong> ${product.rating} / 5</p>
                        
                        <div class="acciones-producto">
                            <button class="botonEditar" onclick="editar(${product.id})">Editar</button>
                            <button class="botonEliminar" onclick="eliminar(${product.id})">Eliminar</button>
                        </div>
                    </div>
                </div>`;
    return productoHTML;
}

function procesarEliminacion(id){
    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
        })
    .then(res => res.json())
    .then(()=>{
        alert("producto eliminado")
        document.getElementById('prod-' + id).remove()
    });
}

function eliminar(id){
    if (confirm("¿Estas seguro de eliminar este producto?")) {
        procesarEliminacion(id)
    } else {
        alert("Eliminación cancelada");
    }
}

function cancelar() {
    window.location.href = "dashBoardAdmin.html";
}