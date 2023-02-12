const controlBtn = document.querySelector("button.control---btn");

const registerForm = document.querySelector(".register__form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  controlBtn.classList.add("inprogress");
  controlBtn.children[0].style.display = "block";

  const formData = new FormData(registerForm);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);

  const fetchResp = await fetch("/register", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  const response = await fetchResp.json();
  const { success, message } = response;
  messageHandler(success, message, "login");
});
