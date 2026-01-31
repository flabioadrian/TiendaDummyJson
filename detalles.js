const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');
const contenedor = document.getElementById('contenedor-detalle');
const muro = document.getElementById('recomendaciones');

if (productoId) {
    obtenerDetalleProducto(productoId);
} else {
    alert("No se encontro ningun ID en la URL");
}

function obtenerDetalleProducto(id) {
    fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(producto => {
            contenedor.innerHTML = `
                <h1>${producto.title}</h1>
                <div class="detalle-flex">
                    <img src="${producto.images[0]}" alt="${producto.title}" class="detalle-imagen">
                    <div class="info">
                        <p><strong>Descripción:</strong> ${producto.description}</p>
                        <p><strong>Precio:</strong> $${producto.price}</p>
                        <p><strong>Marca:</strong> ${producto.brand}</p>
                        <p><strong>Categoría:</strong> ${producto.category}</p>
                        <p><strong>Stock:</strong> ${producto.stock} unidades</p>
                        <p><strong>Rating:</strong> ${producto.rating} /5</p>
                        <p><Strong> Opiniones:</Strong></p>
                        <ul>
                            ${mostrarOpiniones(producto.reviews)}
                        </ul>
                    </div>
                </div>
            `;
            cargarProductosRelacionados(producto.category, producto.id);
        })
        .catch(err => alert("Error al obtener el producto:", err));
};

function cargarProductosRelacionados(categoria, excludeId){
    fetch(`https://dummyjson.com/products/category/${categoria}`)
    .then(res => res.json())
    .then((data) => {
        data.products.forEach((producto) => {
            const productoHTML = `
                <div id="prod-${producto.id}" onclick="mostrarInfo(${producto.id})" class="producto">
                    <h3>${producto.title}</h3>
                    <img src="${producto.thumbnail}" alt="${producto.title}">
                    <p>Precio: $${producto.price}</p>
                    <p>Categoría: ${producto.category}</p>
                    <p>Rating: ${producto.rating} /5</p>
                </div>`;
            if(muro.getElementsByClassName('producto').length >= 4) return;
            if(producto.id !== excludeId) muro.insertAdjacentHTML('beforeend', productoHTML);
        });
    });
};

function mostrarOpiniones(resenias) {
    if (!resenias || resenias.length === 0) {
        return '<li>No hay opiniones disponibles.</li>';
    }

    return resenias.map(resenia => `
        <li class="opinion-item">
            <strong>${resenia.reviewerName}</strong> (${resenia.rating}/5)
            <br>
            <em>"${resenia.comment}"</em>  </li>
    `).join('');
}

const mostrarInfo = (id) => {
    window.location.href = `detalles.html?id=${id}`;
};