const socket = io();

// socket.emit("message", "¡Hola, me estoy comunicando desde un websocket!")

// socket.on('evento_para_socket_individual', (data) => console.log(data));

// socket.on('evento_para_todos_menos_el_socket_actual', (data) => console.log(data));

// socket.on('evento_para_todos', (data) => console.log(data));

// io.on('connection', (socket) => {
//     socket.on('new product', (data) => {
//         // postProductIo(data.title, data.description, data.code, data.price, data.stat, data.stock, data.category, data.thumb);
//         console.log(data);
//     });
// });

const lista = document.querySelector('#listaProductos');

socket.on('updated', (data) => {
    lista.innerHTML = '';
    for (let i = 0; i < Object.keys(data.products).length; i++) {
        lista.innerHTML += `<ul><li>ID: ${data.products[i + 1].id}</li>
                            <li>Nombre: ${data.products[i + 1].title}</li>
                            <li>Codigo: ${data.products[i + 1].code}</li>
                            <li>Precio: ${data.products[i + 1].price}</li>
                            <li>Categoria: ${data.products[i + 1].category}</li>
                            <li>Stock: ${data.products[i + 1].stock}</li></ul>`;
    }
});