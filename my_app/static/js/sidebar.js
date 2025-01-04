document.addEventListener('DOMContentLoaded', () => {

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("logOut");
    var btn2 = document.getElementById("close");
  
    btn.onclick = function () {
      modal.style.display = "flex";
    };
  
    btn2.addEventListener("click", (event) => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});