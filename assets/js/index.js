'use strict';

import io from 'socket.io-client';
window.addEventListener('load', () => {
var socket = io.connect(location.origin, {'force new connection': true});
var items = [];
socket.on('connect', (data) => {
    console.log('connected');
});
socket.on('insert', (data) => {
    console.log('insert',data);
    items.push(data.data);
    buildItems();
});
socket.on('delete', (data) => {
    console.log('delete', data);
    items = items.filter((item) => {
            return item.id !== data.data.id
        });
    buildItems();
});
socket.on('update', (data) => {
    console.log('update', data);
    items.forEach((item, idx) => {
        if (item.id === data.newData.id) {
        items[idx] = data.newData;
    }
    });
    buildItems();
});
var elem =  document.getElementsByClassName('list-container')[0];
var userElem = document.getElementsByClassName('user-container')[0];
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

var xhr2 = new XMLHttpRequest();
xhr2.open('GET', '/auth/user', true);
xhr2.onreadystatechange = () => {
    if (xhr2.readyState == 4) {
        if(xhr2.status == 200) {
            var user = JSON.parse(xhr2.responseText);
            userElem.innerHTML = `<div>
   <img src=${user.avatarUrl}/>
   <p><a href=${user.url} target="_blank">
   ${user.name ||  user.login}
   </a></p>
   <div>
   <a href="/auth/logout">Logout</a>`;
        } else {
            userElem.innerHTML = `<div><a href="/auth/login/github">Login via github</a></div>
            <div><a href="/auth/login/facebook">Login via facebook</a></div>`;
        }
    }
};
xhr2.send(null);

function buildItems() {
    var lis = [];
    for (let i = 0; i < items.length; i++) {
        lis.push(`<li>${items[i].id} | ${items[i].title}</li>`);
    }
    elem.innerHTML = lis.join('\n');
}
})
;