// adding new chat documents
// setting up a realtime listener to get new chats
// updating the username
// updating the room

class Chatroom {
  
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }

  async addChat(message) {
    // format a chat onject
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    }

    const response = await this.chats.add(chat);
    return response;
  }

  getChats(callback) {
    this.us = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added') {
            // update ui
            callback(change.doc.data())
          }
        })
      })
  }

  updateName(username) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  updateRoom(room) {
    this.room = room;
    console.log('room updated');
    if(this.unsub) {
      this.unsub();
    }
  }
}


// render chat template to the dom
// clear the list of chats (when the room changes)

class ChatUI {
  
  constructor(list) {
    this.list = list;
  }

  render(data) {
    const when = dateFns.distanceInWordsToNow(
      data.created_at.toDate(),
      {addSuffix: ' ago'}
    );
    const html = `
      <li class="list-group-item">
        <span class="username">${data.username}</span>
        <span class="message">${data.message}</span>
        <div class="time">${when}</div>
      </li>
    `;

    this.list.innerHTML += html;
    // console.log(html);
  }

  clear() {
    this.list.innerHTML = '';
  }
}

const chatList = document.querySelector('.chat-list')
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMsg = document.querySelector('.update-msg');
const rooms = document.querySelector('.chat-rooms');

// check localstorage
const username = localStorage.username ? localStorage.username : 'anonim';

const chatUi = new ChatUI(chatList);
const chatroom = new Chatroom('general', username);

// get the chat and renders
chatroom.getChats(data => chatUi.render(data));

// add new chat
newChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = newChatForm.message.value.trim();
  chatroom.addChat(message)
    .then(() => newChatForm.reset())
    .catch(err => console.log(err));
})

// update username
newNameForm.addEventListener('submit', e => {
  e.preventDefault();
  const newName = newNameForm.name.value.trim();
  chatroom.updateName(newName);
  newNameForm.reset();
  updateMsg.innerText = `Your name was update to ${newName}`;
  setTimeout(() => {
    updateMsg.innerText = '';
  },3000)
})

// update chat room
rooms.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON') {
    chatUi.clear();
    const room = e.target.getAttribute('id');
    // console.log(room);
    chatroom.updateRoom(room);
    chatroom.getChats(data => chatUi.render(data));
    // chatroom.getChats(data => ChatUI.render(data));
  }
})