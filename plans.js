import { EmojiButton } from './emoji.js';
const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const monthShotNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];	
const weekHeads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDateTime = `${currentYear}-`+currentDay+monthShotNames[currentMonth-1]+`-${today.getHours() % 12 || 12}`+`${today.getHours() >= 12 ? 'P' : 'A'}`+String(today.getMinutes()).padStart(2,'0')+"-"+String(today.getSeconds()).padStart(2,'0');
const plannerData = JSON.parse(localStorage.getItem("plannerData") || "{}");

const titleTag = document.getElementById("titleTag");
const topHead = document.getElementById("topHead");
const monthGrid = document.getElementById("monthGrid");
const monthGridMobile = document.getElementById("monthGridMobile");
const calendarContainer = document.getElementById("calendarContainer");

titleTag.textContent = titleTag.textContent + ` ${currentYear}`;
topHead.textContent = topHead.textContent + ` ${currentYear}`;

function createPlannerControls(containerId = 'plannerControls') {
  const container = document.createElement('div');
  container.style.marginBottom = '10px';
  
  const digitContainer = document.createElement('div');
  digitContainer.id ="dclock";
  digitContainer.innerHTML = "00:00:00";
  container.appendChild(digitContainer);

  // Export Button
  const exportBtn = document.createElement('button');
  exportBtn.textContent = '💾 Export';
  exportBtn.onclick = exportPathPlanner;
  container.appendChild(exportBtn);

  // Hidden Import File Input
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'importFile';
  importInput.accept = '.json';
  importInput.style.display = 'none';
  importInput.onchange = importPlanner;
  container.appendChild(importInput);

  // Import Button
  const importBtn = document.createElement('button');
  importBtn.textContent = '📂 Import';
  importBtn.onclick = () => ImportPathPlanner();
  container.appendChild(importBtn);
  
  // Hidden G-Cal Import File Input
  const gCalinput = document.createElement('input');
  gCalinput.type = 'file';
  gCalinput.id = 'gImportFile';
  gCalinput.accept = '.ics';
  gCalinput.onchange = function () {
    importICS(this.files[0], updatePlanner);
  };
  gCalinput.style.margin = '10px';
  gCalinput.style.display = 'none'; 
  container.appendChild(gCalinput); 

  // Google Import Button  
/*  const gImportBtn = document.createElement('button');
  gImportBtn.textContent = 'G📅 Import';
  gImportBtn.onclick = () => gCalinput.click()
  container.appendChild(gImportBtn);*/
  
  // Google export Button  
/*  const gExportBtn = document.createElement('button');
  gExportBtn.textContent = 'G📅 Export';
  gExportBtn.onclick = () => exportPlannerToICS(plannerData);
  container.appendChild(gExportBtn);  */

  // Append to target container
  const target = document.getElementById(containerId) || document.body;
  target.appendChild(container);
}
function createAnalogClock(containerId = 'calendarContainer') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  const clock = document.createElement('div');
  clock.className = 'analog-clock';

  const hourHand = document.createElement('div');
  hourHand.className = 'hand hour';
  hourHand.id = 'hourHand';

  const minuteHand = document.createElement('div');
  minuteHand.className = 'hand minute';
  minuteHand.id = 'minuteHand';

  const secondHand = document.createElement('div');
  secondHand.className = 'hand second';
  secondHand.id = 'secondHand';

  const centerDot = document.createElement('div');
  centerDot.className = 'center-dot';
  
  const tickZero = document.createElement('div');
  tickZero.className = 'tick zero';
  
  const tickOne = document.createElement('div');
  tickOne.className = 'tick one';
  
  const tickTwo = document.createElement('div');
  tickTwo.className = 'tick two';

  const tickThree = document.createElement('div');
  tickThree.className = 'tick three';
  
  const tickFour = document.createElement('div');
  tickFour.className = 'tick four';
  
  const tickFive = document.createElement('div');
  tickFive.className = 'tick five';

  const tickSix = document.createElement('div');
  tickSix.className = 'tick six';    
  
  const tickSeven = document.createElement('div');
  tickSeven.className = 'tick seven';
  
  const tickEight = document.createElement('div');
  tickEight.className = 'tick eight';  
  
  const tickNine = document.createElement('div');
  tickNine.className = 'tick nine';  

  const tickTen = document.createElement('div');
  tickTen.className = 'tick ten';
  
  const tickEleven = document.createElement('div');
  tickEleven.className = 'tick eleven';  

  clock.appendChild(minuteHand);
  clock.appendChild(hourHand);  
  clock.appendChild(secondHand);
  clock.appendChild(centerDot);
  clock.appendChild(tickZero);
  clock.appendChild(tickOne);
  clock.appendChild(tickTwo);  
  clock.appendChild(tickThree);
  clock.appendChild(tickFour);  
  clock.appendChild(tickFive);  
  clock.appendChild(tickSix);
  clock.appendChild(tickSeven);  
  clock.appendChild(tickEight);  
  clock.appendChild(tickNine);
  clock.appendChild(tickTen);  
  clock.appendChild(tickEleven);  
  
  container.appendChild(clock);
}


function createPopupEditor(containerId = 'body') {
  const container = containerId === 'body' ? document.body : document.getElementById(containerId);

  const popupEditor = document.createElement('div');
  popupEditor.id = 'popupEditor';
  popupEditor.style.display = 'none';
  popupEditor.style.position = 'fixed';
  popupEditor.style.top = '10%';
  popupEditor.style.left = '50%';
  popupEditor.style.transform = 'translateX(-50%)';
  popupEditor.style.background = '#fff';
  popupEditor.style.border = '1px solid #ccc';
  popupEditor.style.padding = '20px';
  popupEditor.style.zIndex = '1000';
  popupEditor.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
  popupEditor.style.width = '85vw';

  const editorContent = document.createElement('textarea');
  editorContent.id = 'editorContent';
  editorContent.contentEditable = 'true';
  editorContent.style.width = '98%';
  editorContent.style.height = '30vh';
  editorContent.style.border = '1px solid #ddd';
  editorContent.style.fontSize = '1.5em';
  editorContent.style.padding = '10px';
  popupEditor.appendChild(editorContent);

  const buttonRow = document.createElement('div');
  buttonRow.style.marginTop = '10px';

  const emojiBtn = document.createElement('button');
  emojiBtn.id = 'emojiTrigger';
  emojiBtn.textContent = '😊';
  buttonRow.appendChild(emojiBtn);

  const dateBtn = document.createElement('button');
  dateBtn.textContent = '📅';
  dateBtn.onclick = insertDate;
  buttonRow.appendChild(dateBtn);
  
  const timeBtn = document.createElement('button');
  timeBtn.textContent = '⌚';
  timeBtn.onclick = insertTime;
  buttonRow.appendChild(timeBtn);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾';
  saveBtn.onclick = saveNote;
  buttonRow.appendChild(saveBtn);
  
  const cleanBtn = document.createElement('button');
  cleanBtn.textContent = '🧹';
  cleanBtn.onclick = cleanNote;
  buttonRow.appendChild(cleanBtn);  

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '❌';
  closeBtn.onclick = closeEditor;
  buttonRow.appendChild(closeBtn);

  const helpBtn = document.createElement('button');
  helpBtn.textContent = '📘 Help';
  helpBtn.onclick = toggleCheatSheet;
  buttonRow.appendChild(helpBtn);

  popupEditor.appendChild(buttonRow);

  const cheatSheet = document.createElement('div');
  cheatSheet.id = 'cheatSheet';
  cheatSheet.style.display = 'none';
  cheatSheet.style.fontSize = '1.8em';
  cheatSheet.style.marginTop = '10px';
  cheatSheet.style.borderTop = '1px solid #ccc';
  cheatSheet.style.paddingTop = '10px';
  cheatSheet.innerHTML = `
    <strong>Markdown Tips:</strong><br>
    <code># Heading Level 1</code><br>
    <code>## Heading Level 2</code><br>	
	<code>### Heading Level 3</code><br>
	<code>#### Heading Level 4</code><br>
    <code>**bold**</code>, <code>*italic*</code><br>
    <code>~~strike~~</code>, <code>~~--double--~~</code><br>
    <code>- list item</code><br>
    <code>[link](https://example.com)</code><br>
    <code>![alt](https://example.com/image.png)</code>
  `;
  popupEditor.appendChild(cheatSheet);
  container.appendChild(popupEditor);
}

createPlannerControls('importExport');
createAnalogClock('importExport');
createPopupEditor();
	
monthNames.forEach((name, index) => {
  const div = document.createElement("div");
  div.className = "month";
  div.textContent = name;
  div.dataset.month = index;
  div.addEventListener("click", () => {
	  document.querySelectorAll(".month").forEach(el => el.classList.remove("selected"));
	  div.classList.add("selected");
	  showCalendar(index);
	  });
    monthGrid.appendChild(div);
  });

monthShotNames.forEach((name, index) => {
  const div = document.createElement("div");
  div.className = "month-shot";
  div.textContent = name;
  div.dataset.month = index;
  div.addEventListener("click", () => {
	  document.querySelectorAll(".month-shot").forEach(el => el.classList.remove("selected"));
	  div.classList.add("selected");
	  showCalendar(index);
	  });
    monthGridMobile.appendChild(div);
  });
  

function showCalendar(monthIndex) {
  calendarContainer.innerHTML = "";

  const calendar = document.createElement("div");
  calendar.className = "calendar";
  calendar.style.display = "block";

  // Weekday headers
  const weekdays = document.createElement("div");
  weekdays.className = "weekdays";
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
    const wd = document.createElement("div");
    wd.textContent = day;
    wd.className = "tday";
    weekdays.appendChild(wd);
  });
  calendar.appendChild(weekdays);

  const days = document.createElement("div");
  days.className = "days";

  // Adjust for leap year
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  const daysInMonthAdjusted = [...daysInMonth];
  if (isLeapYear) daysInMonthAdjusted[1] = 29;

  // Calculate offset (how many empty cells before day 1)
  const firstDay = new Date(currentYear, monthIndex, 1).getDay(); // 0 = Sunday
  const offset = (firstDay + 6) % 7; // shift so Monday = 0

  // Add empty cells for alignment
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    days.appendChild(empty);
  }

  // Render actual days
  for (let i = 0; i < daysInMonthAdjusted[monthIndex]; i++) {
    const day = document.createElement("div");
	//console.log(i,(i+offset) % 7, weekHeads[(i+offset) % 7])
	if ((i+offset) % 7 == 5 || (i+offset) % 7 == 6){
	  day.className = "day weekends";
	} else {
      day.className = "day";
	}
    day.dataset.day = i + 1;

    const dayTitle = document.createElement("div");
    dayTitle.className = "day-title";
    dayTitle.textContent = i + 1;
    day.appendChild(dayTitle);	
	day.addEventListener("click", () => openEditor(day, key));

    const key = `${currentYear}-${monthIndex}-${i + 1}`;
    if (plannerData[key]) {
      const formatted = formatMarkdown(plannerData[key]);
      const note = document.createElement("div");
      note.style.fontSize = "0.75em";
      note.innerHTML = `<div class="md-output sree-note">${formatted}</div>`;
      day.appendChild(note);
    }
	 
    if (monthIndex === currentMonth && i + 1 === currentDay) {
      day.classList.add("today");
    }

    day.addEventListener("click", () => {
      const textarea = document.createElement("textarea");
      textarea.className = "editor";
      textarea.value = plannerData[key] || "";
      day.innerHTML = "";
      day.appendChild(textarea);
      textarea.focus();

      textarea.addEventListener("blur", () => {
        plannerData[key] = textarea.value;
        localStorage.setItem("plannerData", JSON.stringify(plannerData));
        const formatted = formatMarkdown(textarea.value);
        day.innerHTML = "";
        day.appendChild(dayTitle);
        dayTitle.textContent = i + 1;
        const note = document.createElement("div");
        note.style.fontSize = "0.8em";
        note.innerHTML = `<div class="md-output sree-note">${formatted}</div>`;
        day.appendChild(note);

        if (monthIndex === currentMonth && i + 1 === currentDay) {
          day.classList.add("today");
        }
      });
    });

    days.appendChild(day);
  }
  calendar.appendChild(days);
  calendarContainer.appendChild(calendar);
  aTag(); 
  markHolidayContainers();
}

function exportPathPlanner() {
  const useICS = confirm("Do you want to export as Google Calender?\nClick OK for Google Calender, Cancel for Plain JSON Calender.");
  if (useICS) {
    exportPlannerToICS_google(plannerData);
  } else {
    exportPlanner();
  }
}

function ImportPathPlanner() {
  const useICS = confirm("Do you want to Import as Google Calender?\nClick OK for Google Calender, Cancel for Plain JSON Calender.");
  const gCalinput = document.getElementById('gImportFile');
  const importInput = document.getElementById('importFile');
  if (useICS) {
    gCalinput.click();
  } else {
    importInput.click();
  }
}

	
function exportPlanner() {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDateTime = `${currentYear}-`+currentDay+monthShotNames[currentMonth-1]+`-${now.getHours() % 12 || 12}`+`${now.getHours() >= 12 ? 'P' : 'A'}`+String(now.getMinutes()).padStart(2,'0')+"-"+String(now.getSeconds()).padStart(2,'0');
  const dataStr = JSON.stringify(plannerData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `YP${currentDateTime}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importPlanner() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      Object.assign(plannerData, importedData);
      localStorage.setItem("plannerData", JSON.stringify(plannerData));
      alert("Planner data imported successfully!");
      calendarContainer.innerHTML = ""; // Refresh calendar if open
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

function formatMarkdown(text) {
  const chead =`|Time|Events|
|--- |--- |
`;
  return marked.parse(chead + text);
}

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  mangle: false,
  headerIds: false
});

function showMarkdown(key) {
  const container = document.getElementById(`md-${key}`);
  const raw = plannerData[key] || '';
  container.innerHTML = formatMarkdown(raw);
  container.style.display = 'block';
  aTag(); 
}

let activeDayDiv = null;
let activeKey = null;

function openEditor(dayDiv, key) {
  activeDayDiv = dayDiv;
  activeKey = key;
  //const existing = plannerData[key] || '';
  //document.getElementById("editorContent").value = existing;
  document.getElementById("editorContent").value = plannerData[key] || '';

  document.getElementById("popupEditor").style.display = "block";
}

function insertEmoji() {
  document.getElementById("editorContent").value += " 😊";
}

function insertDate() {
  const now = new Date();
  //const stamp = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours() % 12 || 12}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  //document.getElementById("editorContent").value += ` 📅${stamp}`;
    const stamp = `${now.getDate()}/${now.getMonth()+1} `;
  insertAtCursor(`📅 ${stamp} `);
}

function insertTime() {
  const now = new Date();
  const stamp = `${now.getHours() % 12 || 12}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  insertAtCursor(`${stamp} | `);
}

function toggleCheatSheet() {
  const sheet = document.getElementById("cheatSheet");
  sheet.style.display = sheet.style.display === "none" ? "block" : "none";
}

const picker = new EmojiButton();

picker.on('emoji', selection => {
  const editor = document.getElementById('editorContent');
  //editor.value += selection.emoji;
  if (savedRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
  setTimeout(() => {
	editor.focus();
    insertAtCursor(selection.emoji);
  }, 50);
});

let savedRange = null;
document.getElementById('emojiTrigger').addEventListener('click', () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }
  picker.togglePicker(document.getElementById('emojiTrigger'));

  // Wait briefly to ensure DOM is updated
  setTimeout(() => {
    const pickerWrapper = document.querySelector('.emoji-picker__wrapper');
    if (pickerWrapper) {
      pickerWrapper.style.position = 'fixed';
      pickerWrapper.style.top = '50%';
      pickerWrapper.style.left = '50%';
      pickerWrapper.style.transform = 'translate(-50%, -50%)';
      pickerWrapper.style.zIndex = '9999';
    }
  }, 10);
});
	
document.getElementById('editorContent').addEventListener('input', function (e) {
  const raw = e.target.value;
  //document.getElementById('livePreview').innerHTML = formatMarkdown(raw);
});
	
function closeEditor() {
  if (activeDayDiv && activeKey) {
    const raw = document.getElementById("editorContent").value;
	if (!raw.trim()) {
      delete plannerData[activeKey];
    } else {
      plannerData[activeKey] = raw;
    }
    localStorage.setItem("plannerData", JSON.stringify(plannerData));

    /*plannerData[activeKey] = raw;
    localStorage.setItem("plannerData", JSON.stringify(plannerData));*/

    const formatted = formatMarkdown(raw);
	if (raw.includes('*')){activeDayDiv.classList.add('holiday')} else {activeDayDiv.classList.remove('holiday')}
	if (raw.includes('!')){activeDayDiv.classList.add('is-important')} else {activeDayDiv.classList.remove('is-important')}
	
   activeDayDiv.innerHTML = `
  <div class="day-title">${activeDayDiv.dataset.day}</div>
  <div class="md-output sree-note">${formatted}</div>
    `;
	
  }
  aTag();
  markHolidayContainers();
  document.getElementById("popupEditor").style.display = "none";
  activeDayDiv = null;
  activeKey = null;
    }	

function saveNote() {
  const raw = document.getElementById("editorContent").value;
	if (!raw.trim()) {
      delete plannerData[activeKey];
    } else {
      plannerData[activeKey] = raw;
    }
    localStorage.setItem("plannerData", JSON.stringify(plannerData));
  const formatted = formatMarkdown(raw);
  activeDayDiv.innerHTML = `
    <div class="day-title">${activeDayDiv.dataset.day}</div>
    <div class="md-output sree-note">${formatted}</div>
  `;
  aTag();
  closeEditor();
}	
function cleanNote() {
  if (confirm("🧹 Are you sure to clean this planner?")) {

    document.getElementById("editorContent").value = "";
    const raw = document.getElementById("editorContent").value;
	console.log("RAS", raw);
    plannerData[activeKey] = raw;
    localStorage.setItem("plannerData", JSON.stringify(plannerData));
    const formatted = formatMarkdown(raw);
    activeDayDiv.innerHTML = `
      <div class="day-title">${activeDayDiv.dataset.day}</div>
      <div class="md-output sree-note">${formatted}</div>
    `;
  }
  aTag();
  closeEditor();
}	



	document.querySelector('.emoji-picker__wrapper').removeAttribute('style');
	
function positionEmojiPicker() {
  const pickerWrapper = document.querySelector('.emoji-picker__wrapper');
  if (!pickerWrapper) return;

  const isMobile = window.innerWidth <= 768;
  pickerWrapper.classList.toggle('mobile', isMobile);
  if (isMobile) {
    // Mobile-friendly placement
    pickerWrapper.style.position = 'fixed';
    pickerWrapper.style.top = '60px';
    pickerWrapper.style.left = '10px';
    pickerWrapper.style.right = '10px';
    pickerWrapper.style.width = 'calc(100% - 20px)';
    pickerWrapper.style.zIndex = '9999';
  } else {
    // Desktop placement near trigger
    pickerWrapper.style.position = 'fixed';
    pickerWrapper.style.top = '50%';
    pickerWrapper.style.left = '50%';
	pickerWrapper.style.transform = 'translate(-50%, -50%)';
    pickerWrapper.style.width = '300px';
    pickerWrapper.style.zIndex = '9999';
  }
}

function insertAtCursor(text) {
  const textarea = document.getElementById('editorContent');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentValue = textarea.value;

  // Insert text at cursor
  textarea.value = currentValue.slice(0, start) + text + currentValue.slice(end);

  // Move cursor after inserted text
  const newCursorPos = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = newCursorPos;

  textarea.focus();
}

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1; // smooth transition
  const hourDeg = (hours % 12) * 30 + minutes * 0.5; // 360 / 12

  document.getElementById("secondHand").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  document.getElementById("hourHand").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
}

window.addEventListener("DOMContentLoaded", () => {
  setInterval(updateClock, 1000);
  updateClock();
});

if ('serviceWorker' in navigator) {navigator.serviceWorker.register('./sw.js', {scope: './' }) .then(reg => {console.log('SW registered:', reg.scope);if (!navigator.serviceWorker.controller) {location.reload();}}) .catch(err => console.error('SW registration failed:', err));navigator.serviceWorker.ready.then(() => {if (navigator.serviceWorker.controller) {navigator.serviceWorker.controller.postMessage({type: 'log-added' });} else {console.warn('Service worker not controlling the page yet.');} });}

function aTag(){
  document.querySelectorAll('a[href]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

function markHolidayContainers() {
  document.querySelectorAll('.day').forEach(container => {
    const hasStar = Array.from(container.querySelectorAll('div')).some(div =>
      div.textContent.includes('*')
    );
    if (hasStar) {
      container.classList.add('has-star');
    } else {
      container.classList.remove('has-star'); 
    }
  });
  document.querySelectorAll('.day').forEach(container => {
    const isImportant = Array.from(container.querySelectorAll('div')).some(div =>
      div.textContent.includes('!')
    );	
    if (isImportant) {
      container.classList.add('is-important');
    } else {
      container.classList.remove('is-important'); 
    }
  });
  document.querySelectorAll("table tbody tr").forEach(row => {
  const hasExclamation = Array.from(row.cells).some(cell => cell.textContent.includes("!"));
    if (hasExclamation) {
      row.classList.add("glow-row");
    } else {
	  row.classList.remove("glow-row");
    }
  });
  
}



function updateDigitalClock24h() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('dclock').textContent = `${h}:${m}:${s}`;
}

//setInterval(updateDigitalClock24h, 1000);
//updateDigitalClock24h(); // initial call


function updateDigitalClock12h() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  const formattedHours = String(hours).padStart(2, '0');

  document.getElementById('dclock').textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

setInterval(updateDigitalClock12h, 1000);
updateDigitalClock12h(); // initial call



// 📥 Import .ics → Planner JSON (YYYY-M-D format)

function cleanSummary(raw) {
  // Decode URI-encoded text
  const decoded = decodeURIComponent(raw);

  // Strip HTML tags
  //const stripped = decoded.replace(/<\/?[^>]+(>|$)/g, '');

  // Replace multiple spaces or pipes with clean separators
  return decoded.replace(/\s*\|\s*/g, ' | ').trim();
}

function importICS_old(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const events = parseICS(text);
    const importData = {};

    events.forEach(ev => {
      const d = ev.start;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; // zero-indexed month
      const rawSummary = ev.summary || '';
      const summary = cleanSummary(rawSummary);

      importData[key] = importData[key]
        ? importData[key] + '\n- ' + summary
        : summary;
    });

    console.log("Check 6: ");
    console.log(importData);
    updatePlanner(importData); // Pass to your planner engine
  };
  reader.readAsText(file);
}

function importICS_notOK(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const events = parseICS(text);
    const importData = {};

    events.forEach(ev => {
      const d = ev.start;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; // zero-indexed month
      const rawSummary = ev.summary || '';
      const summary = cleanSummary(rawSummary);

      // Format time as HH:MM AM/PM
      const hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const timeStr = `${hour12}:${minutes} ${ampm}`;

      const line = `${timeStr} | ${summary}`;

      importData[key] = importData[key]
        ? importData[key] + '\n' + line
        : line;
    });

    console.log("Check 6: ");
    console.log(importData);
    updatePlanner(importData); // Pass to your planner engine
  };
  reader.readAsText(file);
}

function importICS(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const events = parseICS(text);
    const importData = {};

    events.forEach(ev => {
      const d = ev.start;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; // zero-indexed month
      const rawSummary = ev.summary || '';
      const summary = cleanSummary(rawSummary);

      // Check if summary already starts with a time pattern like "10:00 AM |"
      const timePattern = /^\d{1,2}:\d{2}\s?(AM|PM)\s?\|/i;
      const line = timePattern.test(summary)
        ? summary
        : (() => {
            const hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            const timeStr = `${hour12}:${minutes} ${ampm}`;
            return `${timeStr} | ${summary}`;
          })();

      importData[key] = importData[key]
        ? importData[key] + '\n' + line
        : line;
    });

    console.log("Check 6: ");
    console.log(importData);
    updatePlanner(importData); // Pass to your planner engine
  };
  reader.readAsText(file);
}




function parseICS_old(data) {
  const events = [];
  const lines = data.split(/\r?\n/);
  let event = {};
  lines.forEach(line => {
    if (line.startsWith('BEGIN:VEVENT')) event = {};
    else if (line.startsWith('DTSTART')) event.start = parseICSTime(line);
    else if (line.startsWith('SUMMARY')) event.summary = decodeURIComponent(escape(line.split(':')[1]));
    else if (line.startsWith('END:VEVENT')) events.push(event);
  });
  return events;
}

function parseICS(data) {
  const events = [];
  const lines = data.split(/\r?\n/);
  let event = {};
  lines.forEach(line => {
    if (line.startsWith('BEGIN:VEVENT')) {
      event = {};
    } else if (line.startsWith('DTSTART')) {
      event.start = parseICSTime(line);
    } else if (line.startsWith('SUMMARY')) {
      event.summary = line.split(':').slice(1).join(':').trim(); // preserve full summary
    } else if (line.startsWith('END:VEVENT')) {
      events.push(event);
    }
  });
  return events;
}


function parseICSTime(line) {
  // Match all variants of DTSTART
  const dateMatch = line.match(/DTSTART(;[^:]*)?:(\d{8})(T\d{6})?(Z)?/);
  if (!dateMatch) return new Date('Invalid');

  const params = dateMatch[1] || '';
  const datePart = dateMatch[2]; // e.g., "20251225"
  const timePart = dateMatch[3]; // e.g., "T090000"
  const isUTC = dateMatch[4] === 'Z';
  const isAllDay = params.includes('VALUE=DATE');
  const tzMatch = params.match(/TZID=([^;]+)/);
  const tzid = tzMatch ? tzMatch[1] : null;

  const year = parseInt(datePart.slice(0, 4), 10);
  const month = parseInt(datePart.slice(4, 6), 10) - 1;
  const day = parseInt(datePart.slice(6, 8), 10);

  if (isAllDay || !timePart) {
    // All-day event: return date at midnight local time
    return new Date(year, month, day);
  }

  const hour = parseInt(timePart.slice(1, 3), 10);
  const minute = parseInt(timePart.slice(3, 5), 10);
  const second = parseInt(timePart.slice(5, 7), 10);

  if (isUTC) {
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  if (tzid) {
    // Timezone-aware: use Intl to convert to local time
    try {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
      const zoned = new Date(new Date(iso).toLocaleString('en-US', { timeZone: tzid }));
      return zoned;
    } catch (e) {
      console.warn('Invalid TZID:', tzid);
      return new Date(year, month, day, hour, minute, second);
    }
  }

  // Local time fallback
  return new Date(year, month, day, hour, minute, second);
}

  function updatePlanner(importedData){
    try {
      Object.assign(plannerData, importedData);
      localStorage.setItem("plannerData", JSON.stringify(plannerData));
      alert("Planner data imported successfully!");
      calendarContainer.innerHTML = ""; // Refresh calendar if open
    } catch (err) {
      alert("Invalid JSON file.");
    }
	}


function parseICSTime_old(line) {
  const raw = line.split(':')[1];
  return new Date(raw.replace(/T/, '').replace(/Z/, ''));
}


//<input type="file" accept=".ics" onchange="importICS(this.files[0], importPlanner)">

function createICSImportInput() {
  const input = document.createElement('input');
  //document.getElementById('importContainer').appendChild(input);
  input.type = 'file';
  input.accept = '.ics';
  input.onchange = function () {
    importICS(this.files[0], updatePlanner);
  };
  input.style.margin = '10px';
  input.style.display = 'block'; // optional styling

  document.body.appendChild(input); // or target a specific container
}

//window.onload = function () {createICSImportInput();};




function exportPlannerToICS_UTC(plannerJson) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDateTime = `${currentYear}-` + currentDay + monthShotNames[currentMonth] + `-${now.getHours() % 12 || 12}` + `${now.getHours() >= 12 ? 'P' : 'A'}` + String(now.getMinutes()).padStart(2, '0') + "-" + String(now.getSeconds()).padStart(2, '0');

  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Planner 2025//EN\n`;

  for (const [key, value] of Object.entries(plannerJson)) {
    const [year, month, day] = key.split('-').map(Number);
    const lines = value.split('\n').map(line => line.trim()).filter(line => line);

    lines.forEach((summary, index) => {
      let hour = 3 + Math.floor(index * 10 / 60); // default fallback
      let minute = (index * 10) % 60;

      // Try to extract time from summary
      const timeMatch = summary.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)\s?\|/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        let m = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        hour = h;
        minute = m;
      }

      const dt = `${year}${pad(month + 1)}${pad(day)}T${pad(hour)}${pad(minute)}00Z`;
      ics += `BEGIN:VEVENT\nDTSTART:${dt}\nSUMMARY:${summary}\nEND:VEVENT\n`;
    });
  }

  ics += `END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GCal-${currentDateTime}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPlannerToICS(plannerJson) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDateTime = `${currentYear}-` + currentDay + monthShotNames[currentMonth] + `-${now.getHours() % 12 || 12}` + `${now.getHours() >= 12 ? 'P' : 'A'}` + String(now.getMinutes()).padStart(2, '0') + "-" + String(now.getSeconds()).padStart(2, '0');

  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Planner 2025//EN\n`;

  // Add VTIMEZONE block for IST
  ics += `BEGIN:VTIMEZONE\nTZID:Asia/Kolkata\nBEGIN:STANDARD\nDTSTART:19700101T000000\nTZOFFSETFROM:+0530\nTZOFFSETTO:+0530\nTZNAME:IST\nEND:STANDARD\nEND:VTIMEZONE\n`;

  for (const [key, value] of Object.entries(plannerJson)) {
    const [year, month, day] = key.split('-').map(Number);
    const lines = value.split('\n').map(line => line.trim()).filter(line => line);

    lines.forEach((summary, index) => {
      let hour = 3 + Math.floor(index * 10 / 60); // fallback
      let minute = (index * 10) % 60;

      // Try to extract time from summary
      const timeMatch = summary.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)\s?\|/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        let m = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        hour = h;
        minute = m;
      }

      const dt = `${year}${pad(month + 1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
      ics += `BEGIN:VEVENT\nDTSTART;TZID=Asia/Kolkata:${dt}\nSUMMARY:${summary}\nEND:VEVENT\n`;
    });
  }

  ics += `END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GCal-${currentDateTime}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function exportPlannerToICS_google(plannerJson) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDateTime = `${currentYear}-` + currentDay + monthShotNames[currentMonth] + `-${now.getHours() % 12 || 12}` + `${now.getHours() >= 12 ? 'P' : 'A'}` + String(now.getMinutes()).padStart(2, '0') + "-" + String(now.getSeconds()).padStart(2, '0');

  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Planner 2025//EN\n`;

  // Add VTIMEZONE block for IST
  ics += `BEGIN:VTIMEZONE\nTZID:Asia/Kolkata\nBEGIN:STANDARD\nDTSTART:19700101T000000\nTZOFFSETFROM:+0530\nTZOFFSETTO:+0530\nTZNAME:IST\nEND:STANDARD\nEND:VTIMEZONE\n`;

  for (const [key, value] of Object.entries(plannerJson)) {
    const [year, month, day] = key.split('-').map(Number);
    const lines = value.split('\n').map(line => line.trim()).filter(line => line);

    lines.forEach((summary, index) => {
      let hour = 3 + Math.floor(index * 10 / 60); // fallback
      let minute = (index * 10) % 60;

      const timeMatch = summary.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)\s?\|/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        let m = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        hour = h;
        minute = m;
      }

      const dt = `${year}${pad(month + 1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
      ics += `BEGIN:VEVENT\nDTSTART;TZID=Asia/Kolkata:${dt}\nSUMMARY:${summary}\nEND:VEVENT\n`;
    });
  }

  ics += `END:VCALENDAR`;

  // Convert to base64 and upload via Apps Script
  const blob = new Blob([ics], { type: 'text/calendar' });
  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result.split(',')[1];
    const filename = `GCal-${currentDateTime}.ics`;

    google.script.run.withSuccessHandler(() => {
      alert("ICS file uploaded to Universal folder in Drive.");
    }).uploadToUniversalFolder(filename, base64);
  };

  reader.readAsDataURL(blob);
}





window.addEventListener('load', positionEmojiPicker);
window.addEventListener('resize', positionEmojiPicker);


	window.saveNote = saveNote; 
	window.closeEditor = closeEditor; 
	window.insertDate = insertDate;
	window.toggleCheatSheet = toggleCheatSheet;
	window.insertEmoji = insertEmoji;