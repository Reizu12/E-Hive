document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  const columns = document.querySelectorAll(".column");

  // Card drag events
  cards.forEach((card) => {
    card.addEventListener("dragstart", () => card.classList.add("dragging"));
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  // Column drag events
  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingCard = document.querySelector(".dragging");
      const addNewTask = column.querySelector(".addNewTask");
      column.insertBefore(draggingCard, addNewTask);
    });

    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => column.classList.remove("drag-over"));

    column.addEventListener("drop", () => {
      const draggingCard = document.querySelector(".dragging");
      const addNewTask = column.querySelector(".addNewTask");
      column.insertBefore(draggingCard, addNewTask);
      column.classList.remove("drag-over");
    });
  });

  // Tooltip functionality for .bods elements
  const bodsElements = document.querySelectorAll(".bods");

  bodsElements.forEach((bods) => {
    bods.addEventListener("mouseenter", function () {
      if (this._tooltip) return;

      const name = this.getAttribute("data-name") || "Unknown User";
      const profile = this.getAttribute("data-profile") || "https://via.placeholder.com/32";
      const description = this.getAttribute("data-tooltip") || "No description available.";

      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");

      const title = document.createElement("div");
      title.classList.add("hids");

      const img = document.createElement("img");
      img.src = profile;
      img.alt = name;

      const nameText = document.createElement("span");
      nameText.classList.add("tooltip-title");
      nameText.textContent = name;

      title.appendChild(img);
      title.appendChild(nameText);

      const desc = document.createElement("div");
      desc.classList.add("tooltip-description");
      desc.textContent = description;

      const contentWrapper = document.createElement("div");
      contentWrapper.appendChild(title);
      contentWrapper.appendChild(desc);

      tooltip.appendChild(contentWrapper);

      this.style.position = "relative";
      tooltip.style.position = "absolute";
      tooltip.style.bottom = `-${tooltip.offsetHeight + 120}px`;
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.marginBottom = "10px";

      this.appendChild(tooltip);
      this._tooltip = tooltip;
    });

    bods.addEventListener("mouseleave", function () {
      if (this._tooltip) {
        this._tooltip.classList.add("fade-out");
        setTimeout(() => {
          this._tooltip.remove();
          this._tooltip = null;
        }, 300);
      }
    });
  });
});
