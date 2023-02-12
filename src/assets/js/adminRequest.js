// admin request

const adminBtn = document.querySelector("a.admin-request");

// admin button
if (adminBtn != null) {
  adminBtn.addEventListener("click", (e) => {
    e.preventDefault();

    popupWrapper.style.display = "block";
    popupWrapper.children[0].classList.add("display");

    descPtag.innerHTML =
      "<p>Write : <span style='color:var(--clr-primary)'>Make me as an admin<span></p>";
    popupInput.style.display = "block";
    confirmBtn.classList.add("focused");
    confirmBtn.setAttribute("data-request", "isAdminRequest");
  });
}

// admin request
const handleAdminRequest = async () => {
  const data = { isAdminRequest: true, _id };
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

  closePopup();
  // converting into json
  const response = await fetchResp.json();
  const { success, message, path } = response;
  messageHandler(success, message, path);
};
