window.initialHeader = async function(){
  await set_libraries()
  const current_library = await get_current_library()
  const selectItem = document.getElementById("select-item");
  selectItem.innerHTML = ""
  const blankOption = document.createElement("option");
  selectItem.appendChild(blankOption);

  if(current_library){
    current_library.items.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = item.name;
      selectItem.appendChild(option);
    })
  }
}

window.initialWebsite = function(){
  let website = localStorage.getItem('website') || "[]"

  localStorage.setItem('website', website)
  build_page();
  build_toolbar();
}

window.choose_library = function(){
  const selectedLibrary = document.getElementById("select-library").value;
  const storedLibrary = localStorage.getItem('library');

  if (storedLibrary === null || storedLibrary === "") {
    localStorage.setItem('library', selectedLibrary);
    localStorage.setItem('website', "[]");
    initialHeader();
    build_page();
    build_toolbar();
    checkLibrary();
  } else {
    if (confirm("If you switch libraries, your site will be reset.")) {
      localStorage.setItem('library', selectedLibrary);
      localStorage.setItem('website', "[]");
      initialHeader();
      build_page();
      build_toolbar();
      checkLibrary();
    }
  }
}

window.addElement = async function(){
  let website = JSON.parse(localStorage.getItem('website'));
  let item_name = document.getElementById("select-item").value
  const current_library = await get_current_library()

  current_library.items.forEach((item) => {
    if(item.name == item_name){
      website.push({
        "name": item_name,
        "open": false,
        "variant": item.variants[0],
        "property": [
        ]
      })
    }
  })

  localStorage.setItem('website', JSON.stringify(website));
  document.getElementById("select-item").value = "";
  build_page();
  build_toolbar();
}

window.build_toolbar = async function(){
  let website = JSON.parse(localStorage.getItem('website'));
  const response = await fetch("./components/filemap.json");
  const filemap = await response.json()
  const current_library = await get_current_library();
  if(current_library){
    const items = current_library.items
    document.getElementById('mydivcontent').innerHTML = ""

    website.map((ele, index) => {
      let display_none = ele.open ? "" : "display-none"
      const component = items.find((item) => { return item.name == ele.name })

      let html = "<div class='uni-box-item dragable' ' data-order='" + index + "'><div class=\"uni-item\" ><b>" + ele.name + "</b><div><button class='w-btn w-btn-danger' onclick='delete_item(this)'>Delete</button> <button class='w-btn w-btn-warning' onclick=\"show_detail(this)\">" + (display_none ? "Detail" : "Shorten") + "</button></div></div><div class=\"uni-detail " + display_none + "\"><div class=\"uni-detail-item\">Template:"
      html += "<select class=\"form-select\">"

      component.variants.map(function(variant){
        let selected = variant == ele.variant
        html +=  "<option value=\"" + variant + "\"" + (selected ? "selected" : "") +">" + variant +"</option>"
      })

      html += "</select><button class='btn btn-success' onclick='change_theme(this)'>Save</button></div>"

      let myDiv = document.getElementById('mydivcontent');
      myDiv.innerHTML += html;
    })
  }else{
    document.getElementById('mydivcontent').innerHTML = "";
  }
}

window.build_page = async function() {
  let website = JSON.parse(localStorage.getItem('website'));
  const wrapper = document.getElementById("wrapper");
  const current_library = await get_current_library();
  wrapper.innerHTML = "";

  if(current_library){
    document.getElementById('libraryCss').href = current_library.cdnCss
    document.getElementById('libraryJs').src = current_library.cdnJs


    for (const ele of website) {
      try {
        const componentData = await fetch(`./components/${current_library.folder_path}/${ele.name}/${ele.variant}.json`)
          .then(response => response.json());

        wrapper.insertAdjacentHTML('beforeend', componentData.html);
        addStyle(componentData.css);
      } catch (error) {
        console.error('There is an error has occured:', error);
      }
    }
  }
};

window.show_detail = function(button){
  const website = JSON.parse(localStorage.getItem('website'));
  const parent = button.closest('.uni-box-item').dataset.element;
  const page_name = button.closest('.uni-box-item').dataset.page;
  const order = button.closest('.uni-box-item').dataset.order;

  website[order].open = !website[order].open;

  localStorage.setItem('website', JSON.stringify(website));
  build_toolbar();
}

window.delete_item = function(button){
  const website = JSON.parse(localStorage.getItem('website'));
  const parent = button.closest('.uni-box-item').dataset.element;
  const page_name = button.closest('.uni-box-item').dataset.page;
  const order = button.closest('.uni-box-item').dataset.order;

  website.splice(order, 1)
  localStorage.setItem('website', JSON.stringify(website));

  build_toolbar()
  build_page()
}

window.change_theme = function(button){
  let theme_type = button.previousElementSibling.value
  const parent = button.closest('.uni-box-item').dataset.element;
  const page_name = button.closest('.uni-box-item').dataset.page;
  const order = button.closest('.uni-box-item').dataset.order;

  const website = JSON.parse(localStorage.getItem('website'));
  website[order].variant = theme_type
  localStorage.setItem('website', JSON.stringify(website));

  build_toolbar()
  build_page()
}


window.get_current_library = async function(button){
  const response = await fetch("./components/filemap.json");
  const filemap = await response.json()
  const currentLibrary = localStorage.getItem('library')
  const library = filemap.find((ele) => { return ele.name == currentLibrary})
  return library;
}

function addStyle(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.getElementById('wrapper').appendChild(style);
}

window.set_libraries = async function(button){
  const response = await fetch("./components/filemap.json");
  const filemap = await response.json()
  const libraries = filemap.map((ele) => ele.name)

  html = "<option></option>"

  libraries.map(function(library){
    let selected = library == localStorage.getItem('library');
    html +=  "<option value=\"" + library + "\"" + (selected ? "selected" : "") +">" + library +"</option>"
  })

  let librarySelect = document.getElementById('select-library');
  librarySelect.innerHTML = html;
}


initialWebsite();
initialHeader();
checkLibrary();


function checkLibrary() {
  const storedLibrary = localStorage.getItem('library');
  const buttonElement = document.getElementById('chooseLibrary');
  let selected_library = document.getElementById('select-library');

  buttonElement.disabled = selected_library.value == storedLibrary;

  const selectItem = document.getElementById('select-item');
  const selectItemButton = document.getElementById('addElement');

  selectItem.disabled = storedLibrary == null || storedLibrary == "";
  selectItemButton.disabled = storedLibrary == null || storedLibrary == "";
}



const selectedLibrary = document.getElementById('select-library');
selectedLibrary.addEventListener('change', checkLibrary);
