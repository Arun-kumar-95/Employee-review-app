const url = window.location.href;
const _id = url.split("/update/")[1].split("?")[0];
const controlBtn = document.querySelector("button.control---btn");

const updateForm = document.querySelector(".update__form");
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  controlBtn.classList.add("inprogress");
  controlBtn.children[0].style.display = "block";

  const formData = new FormData(updateForm);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);

  const fetchResp = await fetch(`/admin/dashboard/update/${_id}`, {
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
