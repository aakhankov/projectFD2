let todoArray = []; //массив для наполнение объектов при создании дела

const createAppTitle = (title) => { //функция которая создает заголовок
    const appTitle = document.createElement('h1');
    appTitle.innerHTML = title; 

    return appTitle;
}

const createTodoForm = () => { //функция которая создает форму 
    //создаем верстку
    const form = document.createElement('form');  
    const input = document.createElement('input');
    const addButton = document.createElement('button');
    const wrapper = document.createElement('div');  
    //дизейбл кнопки если строка пустая
    addButton.disabled = !input.value.length;
    input.addEventListener('input', ()=> {
        addButton.disabled = !input.value.length;
    });
    //добавляем верстке классы из бутстрапа
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название дела';
    addButton.classList.add('btn', 'btn-primary');
    wrapper.classList.add('input-group-append');
    addButton.textContent = 'Добавить задачу 📈';
    //добавляем кнопку и контейнер
    wrapper.append(addButton);
    form.append(input);
    form.append(wrapper);
    //возвращаем форму, инпут и кнопку
    return {
        form,
        input,
        addButton
    }
}
//функция создания списка задач
const createTodoList = () => {
    const list = document.createElement('ul');
    list.classList.add('list-group');

    return list;
}
//фкнкция создания элементов списка задач
const createTodoItem = (name) => {
    //создаем верстку
    const todoItem = document.createElement('li');
    const btnWrapper = document.createElement('div');
    const doneBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    //добавляем и округляем айдишник элементам
    const randomId = Math.random()*100;
    todoItem.id = randomId.toFixed(0);
    //добавляем классы элементам списка бутстраповские
    todoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    doneBtn.classList.add('btn', 'btn-success');    
    deleteBtn.classList.add('btn', 'btn-danger');
    //заполнение кнопок и элементов списка
    todoItem.textContent = name;
    doneBtn.textContent = 'Готово ✅';
    deleteBtn.textContent = 'Удалить ╳';

    btnWrapper.append(doneBtn, deleteBtn);//добавляем кнопки во врапер
    todoItem.append(btnWrapper);   
    //возвращаем создание элементов
    return {
        todoItem, 
        doneBtn,
        deleteBtn,
        btnWrapper
    }
}

const changeItemDone = (arr, item) => {
    arr.map(obj => {
        if (obj.id === item.id & obj.done === false){
            obj.done = true;
        }else if (obj.id === item.id & obj.done === false){
            obj.done = false;
        }
    });
}
//кнопка готовности задачи
const completeTodoItem = (item, btn) => {
    btn.addEventListener('click', ()=> {
        todoArray = JSON.parse(localStorage.getItem(key));
        item.classList.toggle('list-group-item-success'); //добавляем айтему зеленый цвет и убираем если надо тоглом
        changeItemDone(todoArray, item);

        localStorage.setItem(key, JSON.stringify(todoArray));
    });
}
//функция удаления айтема
const deleteTodoItem = (item, btn) =>{ 
    btn.addEventListener('click', () => {
        if (confirm('Вы уверены? ')){ //спрашивает конфермом точно ли удаляем таску
            todoArray = JSON.parse(localStorage.getItem(key));

            const neaList = todoArray.filter(obj => obj.id!== item.id);
            localStorage.setItem(key, JSON.stringify(neaList));
            item.remove();
        }
    });
}
//самая главная функия, отрисовывает все элементы и отрабатывает все действия
function createTodoApp(container, title, key){
    const appTitle = createAppTitle(title); //создание заголовка
    const appForm = createTodoForm(); //создание формы
    const appList = createTodoList(); //отправка формы  по нажатию

    container.append(appTitle, appForm.form, appList); //помещаем все элементы в форму

    if (localStorage.getItem(key)){
        todoArray = JSON.parse(localStorage.getItem(key));

        for (const obj of todoArray){
            const todoItem = createTodoItem(appForm.input.value);

            todoItem.todoItem.textContent = obj.name;
            todoItem.todoItem.id = obj.id;

            if(obj.done == true){
                todoItem.todoItem.classList.add('list-group-item-success');
            } else {
                todoItem.todoItem.classList.remove('list-group-item-success');
            }

            completeTodoItem(todoItem.todoItem,todoItem.doneBtn); //добавляем в запуск кнопки готов и делит
            deleteTodoItem(todoItem.todoItem,todoItem.deleteBtn);

            appList.append(todoItem.todoItem);
            todoItem.todoItem.append(todoItem.btnWrapper);
        }
    }

    //отправка формы по клику
    appForm.form.addEventListener('submit', e => {
        e.preventDefault();
        
        const todoItem = createTodoItem(appForm.input.value); //функция создания айтема
        //проверка на пустой инпут
        if (!appForm.input.value){
            return;
        }
        completeTodoItem(todoItem.todoItem,todoItem.doneBtn);
        deleteTodoItem(todoItem.todoItem,todoItem.deleteBtn);

        let localStorageData = localStorage.getItem(key);

        if (localStorageData == null) {
            todoArray = [];
        }else {
            todoArray = JSON.parse(localStorageData);
        }

        const createItemObj = (arr) => { //создаем объект
            const itemObj = {};
            itemObj.name = appForm.input.value;
            itemObj.id = todoItem.todoItem.id;
            itemObj.done = false; //по умолчанию в объекте дело не выполнено

            arr.push(itemObj);
        }        
        createItemObj(todoArray);
        localStorage.setItem(key, JSON.stringify(todoArray));

        appList.append(todoItem.todoItem); //помещаем айтем в лист
        appForm.input.value = ''; //обнуляем поле ввода
        appForm.addButton.disabled = !appForm.addButton.disabled; //дизейбл кнопки
    });
}

//запускаем фукнкцию создания приложения и передаем в див index.html
document.addEventListener('DOMContentLoaded', () => {
    createTodoApp(document.getElementById('list-1'), 'Дела, которые ты конечно же забудешь сделать 😡⏳', key =  'List-1');
});