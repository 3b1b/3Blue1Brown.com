// shows correct answer when clicking "check answer" in a question component
const submitAnswer = (button) => {
  const question = button.closest(".question");
  if (!question.querySelector("input:checked")) return;
  const correct = question.querySelectorAll(
    ".answer[data-correct='true'] input:checked"
  ).length
    ? true
    : false;
  question.dataset.reveal = correct;
  question
    .querySelectorAll("label input")
    .forEach((answer) => answer.setAttribute("disabled", ""));
  button.style.display = "none";
};
