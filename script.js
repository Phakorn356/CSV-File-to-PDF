let originalData = [];
let visibleColumns = [];

document.getElementById('csvFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      originalData = results.data;
      const headers = results.meta.fields;
      visibleColumns = [...headers];
      renderColumnSelector(headers);
      renderTable(originalData, headers);
    }
  });
});

function renderColumnSelector(headers) {
  const container = document.getElementById('columnSelector');
  container.innerHTML = '';
  headers.forEach(header => {
    const label = document.createElement('label');
    label.classList.add('form-check-label', 'me-3');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-check-input', 'me-1');
    checkbox.value = header;
    checkbox.checked = true;

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        visibleColumns.push(this.value);
      } else {
        visibleColumns = visibleColumns.filter(col => col !== this.value);
      }
      renderTable(originalData, visibleColumns);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(header));
    container.appendChild(label);
  });
}

function renderTable(data, columns) {
  const thead = document.querySelector('#dataTable thead');
  const tbody = document.querySelector('#dataTable tbody');
  thead.innerHTML = '';
  tbody.innerHTML = '';

  // Render header
  const trHead = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  // Render rows
  data.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col] || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

document.getElementById('exportBtn').addEventListener('click', function () {
  if (!originalData.length || !visibleColumns.length) {
    alert("No data to export.");
    return;
  }

  const filteredData = originalData.map(row => {
    const filteredRow = {};
    visibleColumns.forEach(col => filteredRow[col] = row[col]);
    return filteredRow;
  });

  const csv = Papa.unparse(filteredData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "filtered_data.csv";
  link.click();
});
