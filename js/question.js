// check if answer is correct
const submitAnswer = (button) => {
  const question = button.closest(".question");

  if (!question.querySelector("input:checked")) return;

  const answeredCorrectly = question.querySelectorAll(
    ".question_choice[data-correct='true'] input:checked"
  ).length
    ? true
    : false;

  question.dataset.reveal = answeredCorrectly;

  if (answeredCorrectly)
    question
      .querySelectorAll("input")
      .forEach((input) => (input.disabled = true));
  else question.querySelectorAll(".question_result").forEach(shakeElement);
};

// reset question after getting correct
const resetAnswer = (button) => {
  const question = button.closest(".question");
  button.closest(".question").removeAttribute("data-reveal");
  question
    .querySelectorAll("input")
    .forEach((input) => input.removeAttribute("disabled"));
};
