// slideshow plugin, using the Swiper library

// create slideshows
const createSlideshows = () =>
  new Swiper(".swiper-container", {
    slidesPerView: 'auto',
    spaceBetween: -50,
    centeredSlides: true,
    navigation: {
      prevEl: ".swiper-prev",
      nextEl: ".swiper-next",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
    autoplay: {
      delay: 1000,
      disableOnInteraction: true,
    },
  });

// start script
window.addEventListener("DOMContentLoaded", createSlideshows);
