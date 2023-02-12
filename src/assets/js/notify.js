const checkBoxs = document.querySelectorAll("input[type='checkbox']");
Array.from(checkBoxs).forEach((checkbox) => {
  checkbox.addEventListener("change", async (e) => {
    e.preventDefault();
    let data;
    if (checkbox.checked) {
      data = {
        isRead: true,
        _id: checkbox.getAttribute("id"),
      };
    }

    // send the response
    const fetchResp = await fetch("/user/dashboard/notifications", {
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
