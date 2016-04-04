import io from 'socket.io-client';
window.addEventListener('load', () => {
var socket = io.connect(location.origin, {'force new connection': true});
var items = [];
socket.on('connect', function (data) {
    console.log('connected');
});
socket.on('insert', function (data) {
    console.log('insert',data);
    items.push(data.data);
    buildItems();
});
socket.on('delete', function (data) {
    console.log('delete', data);
    items = items.filter((item) => {
            return item.id !== data.data.id
        });
    buildItems();
});
socket.on('update', function (data) {
    console.log('update', data);
    items.forEach((item, idx) => {
        if (item.id === data.newData.id) {
        items[idx] = data.newData;
    }
    });
    buildItems();
});
var elem =  document.getElementsByClassName('list-container')[0];
var xhr = new XMLHttpRequest();
xhr.open('GET', '/items', true);
xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
        if(xhr.status == 200) {
            items = JSON.parse(xhr.responseText);
            buildItems();
        }
    }
};
xhr.send(null);

function buildItems() {
    var lis = [];
    for (let i = 0; i < items.length; i++) {
        lis.push(`<li>${items[i].id} | ${items[i].title}</li>`)
    }
    elem.innerHTML = lis.join('\n');
}
})