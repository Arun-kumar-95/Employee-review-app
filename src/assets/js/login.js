const controlBtn = document.querySelector("button.control---btn");

const loginForm = document.querySelector(".login--form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  controlBtn.classList.add("inprogress");
  controlBtn.children[0].style.display = "block";

  const formData = new FormData(loginForm);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);

  const fetchResp = await fetch("/login", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  const response = await fetchResp.json();
  const { success, message, path } = response;
  messageHandler(success, message, path);
});
