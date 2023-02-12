const selectIssueAll = document.querySelectorAll(".issueStatus");

Array.from(selectIssueAll).forEach((selectIssue) => {
  selectIssue.addEventListener("change", async () => {
    let selectValue = selectIssue.value;
    let _id = selectIssue.getAttribute("data-id");
    let uid = selectIssue.getAttribute("uid");
    let dataType = selectIssue.getAttribute("data-type");
    // sending the response
    const data = {
      isUpdate: true,
      selectValue,
      _id,
      uid,
      dataType,
    };

    const pathUrl = `/admin/dashboard/profile/${_id}`;
    const fetchResp = await fetch(pathUrl, {
      method: "POST",
      body: JSON.stringify(data),
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
});

// granting the access to send feedback

const grantAccessToggler = document.querySelector(".grant-access");
let isGrant = false;
const dataAccess = grantAccessToggler.getAttribute("data-access");
if (dataAccess == "false") {
  isGrant = false;
  grantAccessToggler.classList.add("success");
} else {
  isGrant = true;
  grantAccessToggler.classList.add("error");
}

isGrant
  ? (grantAccessToggler.textContent = "Deny Access")
  : (grantAccessToggler.textContent = "Grant Access");

grantAccessToggler.addEventListener("click", async (e) => {
  e.preventDefault();
  let uid = grantAccessToggler.getAttribute("uid");
  isGrant
    ? (grantAccessToggler.textContent = "Deny Access")
    : (grantAccessToggler.textContent = "Grant Access");

  isGrant = isGrant ? false : true;

  const data = {
    isGrant,
    uid,
  };

  const pathUrl = `/admin/dashboard/profile/${uid}`;
  const fetchResp = await fetch(pathUrl, {
    method: "POST",
    body: JSON.stringify(data),
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
