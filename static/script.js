const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventDateForm = document.querySelector(".event-date-form"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventSubmit = document.querySelector(".add-event-btn "),
  searchBtn = document.querySelector("#tm-search-btn"),
  evtField = document.querySelector("#evtSearch"),
  locationField = document.querySelector("#locSearch");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

let eventsArr = [];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


//function to initialize calendar. 
async function initCalendar() {
  await getEvents();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;
  let days = "";
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++){
   
    // check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    if ( i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()) 
    {
      activeDay = i;
      getActiveDay(activeDay);
      updateEvents(activeDay);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      }else {
        days += `<div class="day today active">${i}</div>`;
        }
    }else {
        if (event) {
          days += `<div class="day event">${i}</div>`;
        } else {
          days += `<div class="day ">${i}</div>`;
          }
      }
  }

  for (let j = 1; j <= nextDays; j++){
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}


initCalendar();


//set active day day name and date and update container right
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${months[month]} ${date}, ${year}`;
  eventDateForm.value = `${months[month]} ${date}, ${year}`;
}


//event listener when day is clicked
 function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {   
      activeDay = Number(e.target.innerHTML);

      days.forEach((day) => {
        day.classList.remove("active");
      });
      
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        getActiveDay(Number(e.target.innerHTML));
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          }); updateEvents(Number(e.target.innerHTML));
        }, 100);
      } 
      else if (e.target.classList.contains("next-date")) {
        nextMonth();
        getActiveDay(Number(e.target.innerHTML));
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });updateEvents(Number(e.target.innerHTML));
        }, 100);
      } 
      else {
        getActiveDay(Number(e.target.innerHTML)); 
        updateEvents(Number(e.target.innerHTML));
        e.target.classList.add("active");
      }

    });
  });
}

//function to take place when month is changed
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);



//initialize UI without taking user back to today's date.
//use after deleting or adding new events via form
async function initStatus(){
  await getEvents();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const prevLastDay = new Date(year, month, 0);
      const prevDays = prevLastDay.getDate();
      const lastDate = lastDay.getDate();
      const day = firstDay.getDay();
      const nextDays = 7 - lastDay.getDay() - 1;

      date.innerHTML = months[month] + " " + year;
      let days = "";
      for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
      }

      for (let i = 1; i <= lastDate; i++){
        // check if event is present on that day
        let event = false;
        eventsArr.forEach((eventObj) => {
          if (
            eventObj.day === i &&
            eventObj.month === month + 1 &&
            eventObj.year === year
          ) { 
              event = true; 
            }
        });
        if ( i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()) 
        {
          if (event) {
            if(i !== activeDay) {
              days += `<div class="day today event">${i}</div>`;
            }
              else if(i === activeDay){
                days += `<div class="day today active event">${i}</div>`;
              }
          } else {
              if(i !== activeDay) {
                days += `<div class="day today">${i}</div>`;
              }
              else if(i === activeDay){
                days += `<div class="day today active">${i}</div>`;
              }
            }
        } else {
            if (event) {
              if(i !== activeDay) {
                days += `<div class="day event">${i}</div>`;
              }
                else if(i === activeDay){
                  days += `<div class="day active event">${i}</div>`;
                }
            } else {
                if(i !== activeDay) {
                  days += `<div class="day">${i}</div>`;
                }
                else if(i === activeDay){
                  days += `<div class="day active">${i}</div>`;
                }
              }
          }
      }

      for (let j = 1; j <= nextDays; j++){
        days += `<div class="day next-date">${j}</div>`;
      }

      daysContainer.innerHTML = days;
      updateEvents(activeDay);
      addListner();
}



//////event related functions//////////////////////////////////////////////////////////////////////////////////////


// function to update right side list
function updateEvents(date) {
  let events = "";

  eventsArr.forEach((event) => {
    if (date === event.day && 
        month + 1 === event.month && 
        year === event.year )
      { events += 
           `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.name}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${convertTime(event.time)}</span>
            </div>
        </div>`;
      }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  } 
  eventsContainer.innerHTML = events;
}


//form validation for top bar
searchBtn.addEventListener("click", (e)=>{
  const field_1 = evtField.value;
  const field_2 = locationField.value;
  if (field_1 == "" || field_2 == "") {
    alert("all fields must be filled out");
    e.preventDefault();
  } 
});


//function to add event using form
addEventSubmit.addEventListener("click", async (e) => {
  const eventTitle = addEventTitle.value;
  const eventTime = addEventFrom.value;
  const eventDate = eventDateForm.value;
  if(eventTitle==="" || eventTime===""){
    alert("all fields must be filled out");
    return;
  } else{
      res = await addEvent(eventTitle, eventTime, eventDate);
      addEventTitle.value = "";
      addEventFrom.value = "";
      await initStatus();
    }
});



//function to delete event
eventsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      const date = eventDate.innerText;
      res = await deleteEvent(date,eventTitle);
      await initStatus();
    }
  }
});



//////////right side helper functions/////////////////////////////////////////////////////////////////////////////////////////

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}


//function to open add event form
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//allow only time in eventtime field
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});


//////////left side helper functions/////////////////////////////////////////////////////////////////////////////////////////

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});


function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}


gotoBtn.addEventListener("click", gotoDate);

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});



//////HTTP requests//////////////////////////////////////////////////////////////////////////////////////

async function getEvents(){
  const response = await axios.get("/return_events");

  eventsArr = response.data;
}

async function addEvent(title,time,date){
  const response = await axios.post("/add_event", {
    date: date,
    title:title,
    time:time
    }
  );

   return response.data;
}

async function deleteEvent(date,title){
  const response = await axios.delete("/delete_event", { params: {
      date: date,
      title:title
      }});

  return response.data;
}


