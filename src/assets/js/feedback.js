// globals

const slideControl = document.querySelector(".employee-reaction-button");
const empWrap = document.querySelector(".employee-wrapper");
const feedbackMsg = document.getElementById("feedbackmsg");

slideControl.addEventListener("click", function (e) {
  empWrap.classList.toggle("active");
});

// selecting all the start button
const stars = document.querySelectorAll("button.star--btn");

let isChecked = false;
let rating, labeluser;

if (labeluser == undefined) {
  feedbackMsg.textContent = "*Select an employee";
}

// handing the click event for all the stars
Array.from(stars).forEach((star) => {
  star.addEventListener("click", (e) => {
    e.preventDefault();
    rating = star.getAttribute("data-star-value");
    let current = document.querySelector("button.star--btn.active");
    if (current != null) {
      current.classList.remove("active");
    }
    isChecked ? "" : star.classList.add("active");
  });
});

// selecting all the employee and adding to the feedback to section
const users = document.querySelectorAll("a.user");
// applying event listners to all the user

Array.from(users).forEach((user) => {
  user.addEventListener("click", (event) => {
    event.preventDefault();
    labeluser = user.getAttribute("data-user");
    //  putting inside the label user section
    feedbackMsg.style.display = "none";
    document.querySelector("span.feedback--label").textContent = labeluser;
  });
});

// feedback handler

const controlBtn = document.querySelector("button.feedbackBtn");
controlBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  controlBtn.classList.add("inprogress");
  controlBtn.children[0].style.display = "block";
  const feedbackid = controlBtn.getAttribute("data-uid");
  const data = {
    feedbackTo: document
      .querySelector("span.feedback--label")
      .textContent.trim(),
    feedbackFrom: feedbackid,
    feedback: document.getElementById("text-area").value,
    rating,
  };

  // converting into string
  const Payload = JSON.stringify(data);

  const fetchResp = await fetch("/user/dashboard/feedback", {
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
