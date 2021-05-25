// show particular tab/page in lesson gallery
const lessonGalleryTab = (button, show) => {
  const gallery = button.closest(".lesson_gallery");
  gallery.dataset.show = show;
  gallery
    .querySelectorAll(".lesson_gallery_controls > button")
    .forEach((button) => (button.dataset.active = false));
  button.dataset.active = true;
};
