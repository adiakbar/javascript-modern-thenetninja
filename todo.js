const addForm = document.querySelector('.form-add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search');

const generateTemplate = (item) => {
  const html = `
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${item}</span>
    <i class="far fa-trash-alt delete"></i>
  </li>
  `

  list.innerHTML += html;
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const item = addForm.item.value.trim();
  
  if(item.length) {
    generateTemplate(item);
    addForm.reset();
  }
});

list.addEventListener('click', e => {
  if(e.target.classList.contains('delete')) {
    e.target.parentElement.remove();
  }
});

const filterTodos = (term) => {
  Array.from(list.children)
    .filter((todo) => !todo.textContent.includes(term))
    .forEach((todo) => todo.classList.add('filtered'))

  Array.from(list.children)
    .filter((todo) => todo.textContent.includes(term))
    .forEach((todo) => todo.classList.remove('filtered'))
}

search.addEventListener('keyup', e => {
  e.preventDefault();

  const term = search.search.value.trim().toLowerCase();
  filterTodos(term)
})