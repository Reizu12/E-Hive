document.addEventListener("DOMContentLoaded", function () {
    const projectGridContainers = document.querySelectorAll(".project-grid-container");
    const projectGrids = document.querySelectorAll(".project-grid");

    projectGrids.forEach((projectGrid, index) => {
        const projectGridContainer = projectGridContainers[index];
        const projectCards = projectGrid.querySelectorAll(".project-card");
        let isDragging = false;
        let startX;
        let scrollLeft;

        projectCards.forEach((card) => {
            const images = card.querySelectorAll("img");
            images.forEach((img) => {
                img.addEventListener("dragstart", (e) => e.preventDefault());
            });
        });

        const isMouseOverCard = (e) => {
            return Array.from(projectCards).some((card) => {
                const rect = card.getBoundingClientRect();
                return (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                );
            });
        };

        const disableTextSelection = (e) => {
            e.preventDefault();
        };

        projectGrid.addEventListener("mousedown", (e) => {
            if (!isMouseOverCard(e)) return;
            isDragging = true;
            projectGridContainer.classList.add("dragging");
            projectGrid.classList.add("dragging");
            startX = e.pageX - projectGrid.offsetLeft;
            scrollLeft = projectGrid.scrollLeft;
            document.addEventListener("selectstart", disableTextSelection);
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            projectGridContainer.classList.remove("dragging");
            projectGrid.classList.remove("dragging");
            document.removeEventListener("selectstart", disableTextSelection);
        });

        projectGrid.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - projectGrid.offsetLeft;
            const walk = (x - startX) * 2;
            const maxScrollLeft = projectGrid.scrollWidth - projectGrid.clientWidth;
            projectGrid.scrollLeft = Math.min(maxScrollLeft, Math.max(0, scrollLeft - walk));
        });
    });


// Get all elements with the class 'project-card'
let elements = document.getElementsByClassName('project-card');

/*
 * Loop through all elements and apply event listeners
 */
for (let i = 0; i < elements.length; i++) {
  let el = elements[i];

  /* Get the height and width of the element */
  const height = el.clientHeight;
  const width = el.clientWidth;

  /*
   * Add a listener for the mousemove event
   * Which will trigger the function 'handleMove' on mousemove
   */
  el.addEventListener('mousemove', function(e) {
    handleMove(e, el, width, height); // Pass element, width, and height to the function
  });

  /* Add listener for mouseout event to remove the rotation */
  el.addEventListener('mouseout', function() {
    el.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
  });

  /* Add listener for mousedown event to simulate a click */
  el.addEventListener('mousedown', function() {
    el.style.transform = 'perspective(500px) scale(0.9) rotateX(0) rotateY(0)';
  });

  /* Add listener for mouseup event to simulate the release of the mouse click */
  el.addEventListener('mouseup', function() {
    el.style.transform = 'perspective(500px) scale(1.1) rotateX(0) rotateY(0)';
  });
}

/* Define the function to handle mouse movement */
function handleMove(e, el, width, height) {
  /*
    * Get the position of the mouse cursor with respect to the element
    * On mousemove
    */
  const xVal = e.layerX; // Store the x position
  const yVal = e.layerY; // Store the y position

  /*
    * Calculate rotation value along the Y-axis
    * Here the multiplier 20 is to control the rotation
    * You can change the value and see the results
    */
  const yRotation = 5 * ((xVal - width / 2) / width);

  /* Calculate the rotation along the X-axis */
  const xRotation = -5 * ((yVal - height / 2) / height);

  /* Generate string for CSS transform property */
  const string = 'perspective(500px) scale(1.1) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)';

  /* Apply the calculated transformation */
  el.style.transform = string;
}


function getTimeBasedGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
      return 'Good Morning';
  } else if (currentHour < 18) {
      return 'Good Afternoon';
  } else {
      return 'Good Evening';
  }
}

function typeWriterEffect(element, text, speed = 70) {
  let i = 0;
  function type() {
      if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
      }
  }
  element.textContent = '';
  type();
}

// Main function to display greeting with user's name
function displayGreeting() {
  const greetingElement = document.getElementById('greeting');
  console.log("HUI");
  
  const userName = document.getElementById('userName').textContent.trim();
  const greetingMessage = `${getTimeBasedGreeting()}, ${userName}!`;

  typeWriterEffect(greetingElement, greetingMessage);
}

displayGreeting();

const projectGrid = document.querySelector('.project-grid');
const projectGrid2 = document.querySelector('.project-grid2');

if (projectGrid) {
    projectGrid.addEventListener('wheel', (event) => {
        if (event.deltaY !== 0) {
            event.preventDefault();
            projectGrid.scrollLeft += event.deltaY * 3;
        }
    });
}

if (projectGrid2) {
  projectGrid2.addEventListener('wheel', (event) => {
      if (event.deltaY !== 0) {
          event.preventDefault();
          projectGrid2.scrollLeft += event.deltaY * 3;
      }
  });
}

});



// Adjust scrolling with buttons
function scrollButtonLeft() {
  const container = document.querySelector('.project-grid');
  if (container && container instanceof HTMLElement) {
      container.scrollLeft -= 350; 
  }
}

function scrollButtonRight() {
  const container = document.querySelector('.project-grid');
  if (container && container instanceof HTMLElement) {
      container.scrollLeft += 350; 
  }
}

function scrollButtonLeft2() {
  const container = document.querySelector('.project-grid2');
  if (container && container instanceof HTMLElement) {
      container.scrollLeft -= 350; 
  }
}

function scrollButtonRight2() {
  const container = document.querySelector('.project-grid2');
  if (container && container instanceof HTMLElement) {
      container.scrollLeft += 350; 
  }
}


