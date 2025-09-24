// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//Track attendance
let count = 0;
const maxCount = 50; // Set maximum capacity

// Load counts from localStorage
if (localStorage.getItem("totalCount")) {
  count = parseInt(localStorage.getItem("totalCount"));
}

const teamCounts = {};
const teamOptions = teamSelect.options;
for (let i = 0; i < teamOptions.length; i++) {
  const teamValue = teamOptions[i].value;
  if (teamValue) {
    const saved = localStorage.getItem(teamValue + "Count");
    teamCounts[teamValue] = saved ? parseInt(saved) : 0;
    const teamCounter = document.getElementById(teamValue + "Count");
    if (teamCounter) {
      teamCounter.textContent = teamCounts[teamValue];
    }
  }
}

// Update total counter on page load
const totalCounter = document.getElementById("attendeeCount");
if (totalCounter) {
  totalCounter.textContent = count;
}

// Load attendee list from localStorage
let attendeeList = [];
if (localStorage.getItem("attendeeList")) {
  attendeeList = JSON.parse(localStorage.getItem("attendeeList"));
}

// Render attendee list
function renderAttendeeList() {
  const attendeeListDiv = document.getElementById("attendeeList");
  if (attendeeListDiv) {
    attendeeListDiv.innerHTML = "";
    for (let i = 0; i < attendeeList.length; i++) {
      const attendee = attendeeList[i];
      const item = document.createElement("div");
      item.textContent = `${attendee.name} (${attendee.teamName})`;
      attendeeListDiv.appendChild(item);
    }
  }
}
renderAttendeeList();

// Function to handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  //Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Add attendee to list and save
  attendeeList.push({ name: name, team: team, teamName: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
  renderAttendeeList();

  console.log(name, teamName);

  //Increment count and check capacity
  count++;
  localStorage.setItem("totalCount", count);
  console.log("Total check-ins", count);
  // Celebration feature: show message if goal reached
  if (count === maxCount) {
    const celebration = document.getElementById("celebrationMessage");
    if (celebration) {
      celebration.textContent = `🎉 Attendance goal reached! Winning team: ${teamName}`;
      celebration.style.display = "block";
    }
  }

  //Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  console.log(`Progress: ${percentage}%`);

  //Update team counter
  teamCounts[team]++;
  localStorage.setItem(team + "Count", teamCounts[team]);
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];

  //Update total counter
  if (totalCounter) {
    totalCounter.textContent = count;
  }

  //Welcome message
  const message = `🥳Welcome ${name} from ${teamName}!`;
  console.log(message);

  //Progress bar update
  const progressFill = document.getElementById("progressBar");
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
  //Progress text update
  const progressText = document.getElementById("progressText");
  if (progressText) {
    progressText.textContent = `${count} of ${maxCount} checked in (${percentage}%)`;
  }

  //Reset form
  form.reset();
});
