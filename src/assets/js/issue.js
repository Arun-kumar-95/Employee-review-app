const controlBtn = document.querySelector(".submitBtn");
let _id;
controlBtn.addEventListener("click", function (e) {
  _id = controlBtn.getAttribute("data-id");
});

const issueForm = document.querySelector("form.issue-form");
issueForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  controlBtn.classList.add("inprogress");
  controlBtn.children[0].style.display = "block";

  const formData = new FormData(issueForm);
  // converting form data into object
  const res = Object.fromEntries(formData);
  const issue = res.issue;
  const isProblemRequest = true;
  const data = { issue, _id, isProblemRequest };

  //   converting it into json
  const Payload = JSON.stringify(data);

  const fetchResp = await fetch("/user/dashboard/doubt", {
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
