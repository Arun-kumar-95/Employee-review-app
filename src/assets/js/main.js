const userControlBtn = document.querySelector(".user-control");

const userDetails = document.querySelector(".logged-user-details");
const anchors = document.querySelectorAll("li a");
const popupWrapper = document.querySelector(".popup--wrapper");

const confirmBtn = document.querySelector("button.confirm--btn");
const cancelBtn = document.querySelector("button.cancel--btn");
const popupCloseIcon = document.querySelector("span.popup--close--icon");

const descPtag = document.querySelector(".popup--description");
const popupInput = document.querySelector("input.popup--input");
const closeIconArray = [cancelBtn, popupCloseIcon];

userControlBtn.addEventListener("click", (e) => {
  e.preventDefault();

  userControlBtn.classList.toggle("active");
  userDetails.classList.toggle("active");
});

anchors.forEach((anc) => {
  anc.addEventListener("mouseover", (e) => {
    anc.classList.add("tooltip");
  });
});

// logout
const logoutBtn = document.querySelector("button.signout--btn");
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let role = logoutBtn.getAttribute("aria-role");
  handleLogOutRequest(role);
  userControlBtn.classList.toggle("active");
  userDetails.classList.toggle("active");
});

const signOutBtn = document.querySelector("a.sign-out");
// signout button
signOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  popupWrapper.style.display = "block";
  popupWrapper.children[0].classList.add("display");
  descPtag.innerHTML = "  <p>Are you sure you want to continue ?</p>";
  confirmBtn.setAttribute("data-request", "isLogOutRequest");
});

closeIconArray.forEach((btnClose) => {
  btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    closePopup();
  });
});

// close button handler
const closePopup = () => {
  popupWrapper.style.display = "none";
  popupWrapper.children[0].classList.remove("display");
  popupInput.style.display = "none";
  confirmBtn.classList.remove("focused");
  popupInput.value = "";
};

// get the text field value to
popupInput.addEventListener("keyup", (e) => {
  if (popupInput.value == "" || popupInput.value != "Make me as an admin") {
    confirmBtn.classList.add("focused");
  }
  if (e.target.value == "Make me as an admin") {
    confirmBtn.classList.remove("focused");
  }
});

confirmBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let request = confirmBtn.getAttribute("data-request");
  let role = confirmBtn.getAttribute("aria-role");
  if (role == "Employee") {
    role = "user";
  }
  _id = confirmBtn.getAttribute("data-id");
  if (request == "isAdminRequest") {
    handleAdminRequest();
    return;
  }
  if (request == "isLogOutRequest") {
    handleLogOutRequest(role);
    return;
  }
});

// handle logout request

const handleLogOutRequest = async (role) => {
  let pathUrl;

  const res = {
    isLoggedOut: true,
  };

  const Payload = JSON.stringify(res);
  pathUrl = `/${role}/dashboard/logout`;

  const fetchResp = await fetch(pathUrl, {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  closePopup();
  const response = await fetchResp.json();
  const { success, message } = response;
  messageHandler(success, message, " ");
};

// check if the file is choose or not

const fileChoosen = document.getElementById("file");
const uploadbtn = document.querySelector("button.upload-btn");

const uploadWrapper = document.querySelector(".upload--wrapper");
const cancelUpload = document.querySelector("span.cancel-upload");
let fileLength;

fileChoosen.addEventListener("click", () => {
  fileLength = fileChoosen.value.length;
  setTimeout(() => {
    if (fileLength >= 0) {
      uploadWrapper.style.display = "none";
      cancelUpload.style.opacity = "1";
      cancelUpload.classList.add("right-position");
      document.querySelector("button.upload--img").style.display = "block";
    }
  }, 2000);
});

// cancel upload file handler
cancelUpload.addEventListener("click", (e) => {
  e.preventDefault();
  // fileChoosen.value = "";
  fileLength = 0;
  uploadWrapper.style.display = "block";
  cancelUpload.style.opacity = "0";
  cancelUpload.classList.remove("right-position");
  document.querySelector("button.upload--img").style.display = "none";
});
