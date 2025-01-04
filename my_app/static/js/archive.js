document.addEventListener('DOMContentLoaded', function() {
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardView = document.querySelector('.card-view');
    const tableView = document.querySelector('.table-view');

    cardViewBtn.addEventListener('click', function() {
        cardView.classList.add('active');
        tableView.classList.remove('active');
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
    });

    tableViewBtn.addEventListener('click', function() {
        tableView.classList.add('active');
        cardView.classList.remove('active');
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
    });
});