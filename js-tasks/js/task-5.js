const table = document.getElementById('spreadsheet');
let rows = 5;
let cols = 5;

function getKey(r, c) {
    return `cell-${r}-${c}`;
}

function loadCell(r, c) {
    return localStorage.getItem(getKey(r, c)) || '';
}

function saveCell(r, c, value) {
    localStorage.setItem(getKey(r, c), value);
}

function deleteCell(r, c) {
    localStorage.removeItem(getKey(r, c));
}

function renderTable() {
    table.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const row = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('td');
            cell.textContent = loadCell(r, c);
            cell.ondblclick = () => editCell(cell, r, c);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function editCell(cell, r, c) {
    const oldValue = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    input.onblur = () => {
        const newValue = input.value;
        saveCell(r, c, newValue);
        cell.textContent = newValue;
        cell.ondblclick = () => editCell(cell, r, c);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') input.blur();
    };
}

function addRow() {
    rows++;
    renderTable();
}

function addColumn() {
    cols++;
    renderTable();
}

function removeRow() {
    if (rows === 1) return alert("Нельзя удалить последнюю строку.");

    let hasData = false;
    for (let c = 0; c < cols; c++) {
        if (loadCell(rows - 1, c)) {
            hasData = true;
            break;
        }
    }

    if (!hasData || confirm("В последней строке есть данные. Удалить?")) {
        for (let c = 0; c < cols; c++) {
            deleteCell(rows - 1, c);
        }
        rows--;
        renderTable();
    }
}

function removeColumn() {
    if (cols === 1) return alert("Нельзя удалить последний столбец.");

    let hasData = false;
    for (let r = 0; r < rows; r++) {
        if (loadCell(r, cols - 1)) {
            hasData = true;
            break;
        }
    }

    if (!hasData || confirm("В последнем столбце есть данные. Удалить?")) {
        for (let r = 0; r < rows; r++) {
            deleteCell(r, cols - 1);
        }
        cols--;
        renderTable();
    }
}

renderTable();
