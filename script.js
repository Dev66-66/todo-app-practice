document.getElementById('addTask').onclick = () => {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.textContent = taskText;
        document.getElementById('taskList').appendChild(li);
        input.value = '';
    }
};

