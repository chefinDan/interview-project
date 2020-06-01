// Author: Daniel Green <greendan@oregonstate.edu>
// Description: In most situations a Frontend Framework such as Vue or React
//   should be used to present dynamic content to a user. In this case
//   using one would have been overkill.
//   Nevertheless, it is good practice to adopt the design patterns of
//   modern frameworks even when using vanilla javascript.
//   This file is written to be portable and has no external dependencies.
//   Any html file that has a body element can include this script and
//   a table of city/state data will be created.   

var data, tbody, sorted;
const state = 'Oregon';

// called each time the file is requested
(async () => {
  try{
    sorted = false;
    const res = await fetch('./citydata?state=' + state);
    if (res.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + res.status);
      return;
    }
  
    data = await res.json()
    populateTable();
  }
  catch(error){
    console.log(error);
  }
})();

// function to sort the global data array
// alphabetically. If the array is already sorted
// then the array is reversed 
const alphaSort = () => {
  if(!sorted){
    data = data.sort( (a,b) => {
      if(a.city < b.city)
          return -1;
      if(a.city > b.city)
          return 1;
      return 0; 
    });
    sorted = true
  }
  else{
    data.reverse();
  }
  populateTable();
}

// Removes any old data and adds new data to the table 
const populateTable = async () => {
  while(tbody.childNodes.length){
    const row = tbody.childNodes[0];
    tbody.removeChild(row);
  }
  for (const d of data){
    tbody.appendChild(
      createTableRow(d.State, d.city)
    );
  }
}

// creates a tr element with state and city data
const createTableRow = (state, city) => {
  const row = document.createElement('tr'),
        stateCell = row.insertCell(-1),
        cityCell = row.insertCell(-1);
  row.className = 'data-row';
  stateCell.innerText = state;
  cityCell.innerText = city;
  return row;
}

// function to build a basic html table
// and append it to the document body
const buildTable = () => {
  tbody = document.createElement('tbody');
  const body = document.querySelector('body'),
        tableDiv = document.createElement('div')
        table = document.createElement('table'),
        thead = document.createElement('thead'),
        btn = document.createElement('button'),
        headRow = thead.insertRow(0),
        stateHead = document.createElement('th'),
        cityHead = document.createElement('th');
  table.id = 'city-table';
  stateHead.innerText = 'State';
  cityHead.innerText = 'City';
  btn.innerText = 'sort';
  btn.addEventListener('click', () => {alphaSort()});
  headRow.appendChild(stateHead);
  headRow.appendChild(cityHead);
  table.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);
  tableDiv.appendChild(btn);
  body.appendChild(tableDiv);
}

// Each time dom reloads create a table element
document.addEventListener('DOMContentLoaded', () => { 
  buildTable();
});