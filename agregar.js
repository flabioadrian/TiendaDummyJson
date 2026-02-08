const categoriasSelect = document.getElementById('categorias');
const mensajeExito = document.getElementById('mensaje');

const inputNombre = document.getElementById('productName');
const inputPrecio = document.getElementById('productPrice');
const inputCategoria = document.getElementById('categorias');
const inputDescripcion = document.getElementById('productdescription');

cargarCategorias();

function crearProducto() {
    const nombre = inputNombre.value;
    const precio = parseFloat(inputPrecio.value);
    const categoria = inputCategoria.value;
    const descripcion = inputDescripcion.value;

    mensajeExito.style.display = 'block';

    if(!nombre || !categoria || isNaN(precio) || !descripcion) {
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

    fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
        })
        .then(res => res.json())
        .then(data => {
            if(data.id){
                mensajeExito.style.display = 'block';
                mensajeExito.style.background = 'green';
                mensajeExito.style.color = 'white';
                mensajeExito.innerText = 'Producto agregado con éxito';
                setTimeout(() => {
                    limpiarCajas();
                }, 2000);
                }
            else {
                mensajeExito.style.display = 'block';
                mensajeExito.style.background = 'red';
                mensajeExito.style.color = 'white';
                mensajeExito.innerText = "Error al actualizar"
            };
        });
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
};

function limpiarCajas(){
    inputNombre.value = "";
    inputPrecio.value = ""; 
    inputCategoria.value = "";
    inputDescripcion.value = "";
    mensajeExito.style.display = 'none';
}

function cancelar() {
    window.history.back()
}