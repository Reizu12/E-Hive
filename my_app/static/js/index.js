document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
  
    const slidesToShow = 3; // Number of slides to display
    const slideWidth = track.offsetWidth / slidesToShow;
    let currentIndex = 0;
  
    // Update the widths for each slide dynamically
    slides.forEach(slide => (slide.style.minWidth = `${slideWidth}px`));
  
    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  
    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - slidesToShow) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    window.addEventListener('resize', () => {
      slides.forEach(slide => (slide.style.minWidth = `${track.offsetWidth / slidesToShow}px`));
      updateCarousel();
    });
  
    // Initialize carousel
    updateCarousel();
  });
  

  