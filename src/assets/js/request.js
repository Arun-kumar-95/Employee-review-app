// for deleting the students

const deleteBtns = document.querySelectorAll("button.trash-btn");

Array.from(deleteBtns).forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let _id = btn.getAttribute("data-id");
    const data = {
      isDeleteRequest: true,
      _id,
    };

    const fetchResp = await fetch(`/admin/dashboard/notifications`, {
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

// approved employee

const selectIssue = document.getElementById("employeeStatus");

selectIssue.addEventListener("change", async () => {
  let selectValue = selectIssue.value;
  let _id = selectIssue.getAttribute("data-id");
  let uid = selectIssue.getAttribute("uid");

  // sending the response
  const data = {
    isApproved: true,
    selectValue,
    _id,
    uid,
  };

  const pathUrl = "/admin/dashboard/notifications";
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
