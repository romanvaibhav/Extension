let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");
const pdfBtn = document.getElementById("pdf-btn");
const whatBtn = document.getElementById("");

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});
function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

pdfBtn.addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let content = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    // content += `${key}\n`;
    let verticalSpace = 4;
    for (let j = 0; j < value.length; j++) {
      content += `${value[j]}\n`;
      doc.textWithLink(`${j + 1})${value[j]}`, 10, verticalSpace, {
        url: value[j],
      });
      verticalSpace += 6;
    }
    // content += `${key}: ${value}`;
    console.log(content);
  }

  //   doc.text(content, 10, 10);
  doc.save("localStorageData.pdf");
});
