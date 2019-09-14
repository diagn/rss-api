function setEvents() {
    var loadedFile = window.location.pathname;
    console.log(loadedFile);

    switch (loadedFile) {
        case "/feeds.html":
            console.log("loaded feeds");
            clickFeeds();
            break;
        case "/index.html":
            console.log("loaded index");
            clickAdd();
            break;
        case "/items.html":
            console.log("loaded items");
            clickItems();
            break;
    }
};

//Add a new feed on click
function clickAdd() {
    var el = document.getElementById("addBtn");
    if (el != null) {
        el.addEventListener("click", () => {
            var rssUrl = document.getElementById("newRss");
            var check = validateUrl(rssUrl.value);

            if (rssUrl.value.length === 0 || check === false) {
                window.alert("Input must be a valid URL!");
                return false;
            } else {
                var method = "POST", url = "/feed/add", data = {url:rssUrl};
                var obj = {method, url, data}

                doRequestAndDisplayMessage(obj);
            }
        });
    }
};

//Changes the status of a feed
function clickChange() {
    var status = document.getElementById("tableSelect_" + this.dataset.id);
    var selectedValue = status.options[status.selectedIndex].value;
    var method = "POST", url = "/feed/change/", data = {id:this.dataset.id, value:selectedValue}, displayMessage = true, doNotDisplayTable = true;
    var obj = {method, url, data, displayMessage, doNotDisplayTable}

    doRequestAndDisplayMessage(obj);
};

//Shows the table that contains feeds
function clickFeeds() {
    var e = document.getElementById("feedBtn");
    
    if (e != null) {
        e.addEventListener("click", () => {
            var method = "GET", url = "/feeds";
            var obj = {method, url}

            doRequestAndDisplayMessage(obj);
        });
    }
};

//Fetches items 
function clickFetch() {
    var method = "GET", url = "/fetch/" + this.dataset.id, data = false, displayMessage = true, doNotDisplayTable = true;
    var obj = {method, url, data, displayMessage, doNotDisplayTable};
    
    doRequestAndDisplayMessage(obj);
};

//Shows the table that contains fetched items
function clickItems() {
    var e = document.getElementById("itemBtn");
    
    if (e != null) {
        e.addEventListener("click", () => {
            var method = "GET", url = "/items";
            var obj = {method, url}
            
            doRequestAndDisplayMessage(obj);
        });
    }
};

//Handles API requests
function doPromiseRequest(obj) {
    if (typeof obj != "object") {
        return;
    }
    var request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }
            
            if (request.status >= 200) {
                resolve(request);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };
        switch (obj.method) {
            case "GET":
                request.open(obj.method, obj.url);
                request.setRequestHeader("Content-Type", "application/json");
                request.send();
                break;
            case "POST":
                request.open(obj.method, obj.url);
                request.setRequestHeader("Content-Type", "application/json");
                request.send(JSON.stringify(obj.data));
                break;
        }
    });
};

async function doRequestAndDisplayMessage(obj) {
  
    var displayMessage = obj.displayMessage;
   
    await doPromiseRequest(obj).then((resolvedPromise) => {
        var 
            element = document.getElementById("apiResponse"),
            response = resolvedPromise.response;
        
        if (typeof obj.doNotDisplayTable == "undefined") {
            displayContent(response);
        }
        
        if (element != null || displayMessage === true) {
                if (element != null) {
                    element.innerHTML = response;
                } else {
                    var msg = document.getElementById("rspMsgFetch");
                    msg.innerHTML = "";
                    msg.innerHTML = response;
                }
                
                show("message");
            }

    });
}

//Shows elements
function show(target) {
    document.getElementById(target).style.display = 'block';
};

//Hides elements
function hide(target) {
    document.getElementById(target).style.display = 'none';
};

//Dinamically creates the tables & displays content inside them
function displayContent(feeds) {

    var location = window.location.pathname;
    switch(location) {
        case "/feeds.html":
            objId = "copiedTable";
            break;
        case "/items.html":
            objId = "itemsTable";
            break;
        default :
            return false;
    }

    var table = document.getElementById(objId);
    
    j = 0;
    while (table.rows.length > 1) {
        table.deleteRow(j);
        j++;
    }

    feeds = JSON.parse(feeds);
    var body = table.appendChild(document.createElement('tbody'));

    if (objId == "copiedTable") {
        for (var i = 0; i < feeds.length; i++) {

            var select = document.createElement("select");
            select.setAttribute("name", "tableSelect_" + i);
            select.setAttribute("id", "tableSelect_" + feeds[i].id);
            select.setAttribute("class", "selectStyle");

            var btn         = document.createElement("BUTTON");
            btn.innerText   = "Change";
            btn.id          = "changeBtn";
            btn.dataset.id  = feeds[i].id;
            btn.onclick     = clickChange;

            if (i == 0) {
                var header  = table.createTHead(i + 1);
                var row     = header.insertRow(0);
                var cell1   = row.insertCell(0);
                var cell2   = row.insertCell(1);
                var cell3   = row.insertCell(2);
                var cell4   = row.insertCell(3);

                cell1.innerHTML = "ID";
                cell2.innerHTML = "Feed url";
                cell3.innerHTML = "Change status";
                cell4.innerHTML = "Fetch RSS feed items";
            }

            var row     = body.insertRow(-1);
            var cell1   = row.insertCell(0);
            var cell2   = row.insertCell(1);
            var cell3   = row.insertCell(2);
            var cell4   = row.insertCell(3);

            cell1.innerHTML = feeds[i].id;
            cell2.innerHTML = feeds[i].url;

            option              = document.createElement("option");
            option.innerHTML    = "Active";
            option.setAttribute("value", "active");
            select.appendChild(option);

            option              = document.createElement("option");
            option.innerHTML    = "Inactive";
            option.setAttribute("value", "inactive");
            select.appendChild(option);

            option              = document.createElement("option");
            option.innerHTML    = "Removed";
            option.setAttribute("value", "removed");
            
            select.appendChild(option);
            cell3.appendChild(select);
            cell3.appendChild(btn);

            var bttn        = document.createElement("BUTTON");
            bttn.innerText  = "Fetch";
            bttn.dataset.id = feeds[i].id;
            bttn.onclick    = clickFetch;

            bttn.classList.add("fetchTableBtn");
            bttn.setAttribute('type', 'button');
            cell4.appendChild(bttn);
        }

    }
    if (objId == "itemsTable") {
        for (var i = 0; i < feeds.length; i++) {

            if (i == 0) {
                var header  = table.createTHead(i + 1);
                var row     = header.insertRow(0);
                var cell1   = row.insertCell(0);
                var cell2   = row.insertCell(1);

                cell1.innerHTML = "ID";
                cell2.innerHTML = "Fetched item";
            }

            var row     = body.insertRow(-1);
            var cell1   = row.insertCell(0);
            var cell2   = row.insertCell(1);
            
            cell1.innerHTML = feeds[i].id;
            cell2.innerHTML = feeds[i].item;
        };
    }
}

function validateUrl(urlString = "") {
    var check = false;
    try {
        var link = new URL(urlString);
        check = true;
    } catch (exception) {
        check = false;
    }
    return check;
};

//Loads the content before javascript
document.addEventListener('DOMContentLoaded', setEvents, false);