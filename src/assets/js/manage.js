const table = document.querySelector("table.employee-table");
const tableBody = table.querySelector("tbody");
const tableHead = table.querySelector("thead");
const employeeCount = document.querySelector("p.employee--count");
// search for the employee
const searchBtn = document.querySelector(".search--btn");

const filterEmployee = async () => {
  const searchTxt = document.querySelector("#searchInput").value.trim();
  const data = {
    isSearch: true,
    searchTxt,
  };

  //send the request
  const fetchResp = await fetch("/admin/dashboard/manage", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });
  // converting into json
  const response = await fetchResp.json();
  tableBody.innerHTML = "";
  table.style.visibility = "visible";

  if (response.data.length > 0) {
    response.data.forEach((item, index) => {
      // table.classList.add("display");
      table.style.visibility = "visible";

      employeeCount.textContent = `Total Employee : ${response.data.length}`;
      displayResult(item, index);
    });
  } else {
    employeeCount.textContent =
      "*There is no employee matching with the search term";
    table.style.visibility = "hidden";
  }
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  filterEmployee();
});

// DISPLAY RESULT HANDLER
const displayResult = (data, index) => {
  tableBody.innerHTML += `
  <tr>
  <td>
       ${(index = index + 1)}
  </td>
  <td style="text-transform: capitalize">
      ${data.name} 
  </td>
  <td>
      ${data.email}
  </td>
  <td>
      +91-${data.phone}
  </td>
  <td>
      ${data.role}
  </td>

  <td>
      <form action="/admin/dashboard/profile/${data._id}" method="get">
          <button class="profile-btn" type="submit">
              <svg fill="#999" viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet" focusable="false"
                  width="22" height="22" style="pointer-events: none;">
                  <g>
                      <path
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z">
                      </path>
                  </g>
              </svg>
          </button>
      </form>
  </td>
  <td>
      <form action="/admin/dashboard/update/${data._id}" method="get">
          <button class="edit-btn" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  width="20px" height="20px" viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet" focusable="false">
                  <g>
                      <title>Update</title>
                      <path
                          d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z">
                      </path>
                  </g>
              </svg>
          </button>
      </form>
  </td>
  <td>
      <form action="" method="POST">
          <button class="trash-btn" type="submit" data-id="${data._id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  fill="currentColor" viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet" focusable="false"
                  style="pointer-events: none;">
                  <g>
                      <title>Remove</title>
                      <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
                      </path>
                  </g>
              </svg>
          </button>

      </form>
  </td>
</tr>
  `;
};

// if the field is empty the show all
document.querySelector("#searchInput").addEventListener("keyup", (e) => {
  let textvalue = document.querySelector("#searchInput").value.trim();
  if (textvalue.length == 0) {
    filterEmployee();
  }
});

// for deleting the students

const deleteBtns = document.querySelectorAll("button.trash-btn");
Array.from(deleteBtns).forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let _id = btn.getAttribute("data-id");
    let eid = btn.getAttribute("data-eid");
    const data = {
      isDelete: true,
      _id,
      eid
    };

    const fetchResp = await fetch(`/admin/dashboard/manage`, {
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
