var globalfeeds;

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
    var el = document.getElementById( "addBtn" );
    if ( el != null ) {
        el.addEventListener( "click", function() {
            var rssUrl = document.getElementById( "newRss" );
            var check = validateUrl(rssUrl.value);

            if ( rssUrl.value.length === 0 || check === false ){
                window.alert("Input must be a valid URL!");
                return false;
            } else{
                doRequest( "POST", "/feed/add", {url: rssUrl} );
            }
        });
    }
};

//Changes the status of a feed
function clickChange() {
    var status          = document.getElementById( "tableSelect_" + this.dataset.id ); 
    var selectedValue   = status.options[status.selectedIndex].value;

    doRequest( "POST", '/feed/change/', {id: this.dataset.id, value: selectedValue} , false, true );
};

//Shows the table that contains feeds
function clickFeeds() {
    var e = document.getElementById( "feedBtn" );
    if ( e != null ) {
        e.addEventListener( "click", function() {
            doRequest( "GET", "/feeds" );
            displayFeeds( globalfeeds, "copiedTable" );
        });
    }
};

//Fetches items 
function clickFetch() {
    doRequest( "GET", '/fetch/' + this.dataset.id, false, true );
};

//Shows the table that contains fetched items
function clickItems() {
    var el = document.getElementById( "itemsBtn" );
    if ( el != null ) {
        el.addEventListener( "click", function() {
            doRequest( "GET", "/items" );
        });
    }
    var e = document.getElementById( "itemBtn" );
    if ( e != null ) {
        e.addEventListener( "click", function() {
            doRequest( "GET", "/items" );
            displayItems( globalfeeds, "itemsTable" );
        });
    }
};

//Handles API requests
function doRequest( method, url, data = false, displayMessage = false ) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
       if ( this.readyState == 4 && this.status == 200 ) {
            var element = document.getElementById( "apiResponse" );
            
            if ( element != null || displayMessage == 1 ) {
                var container =  document.getElementById( "message" );
                if ( element != null ) {
                    element.innerHTML = globalfeeds = request.response;
                } else {
                    var msg = document.getElementById( "rspMsgFetch" );
                    msg.innerHTML = "";
                    msg.innerHTML = request.response;
                }
               
                show( "message" );
                } else {
                globalfeeds = request.response;
            }
        };
    };
    switch( method ) {
        case "POST" :
            request.open( method, url );
            request.setRequestHeader( "Content-Type", "application/json" );
            request.send( JSON.stringify ( data ));
            break;
        case "GET" :
            request.open( method, url, false );
            request.setRequestHeader( "Content-Type", "application/json" );
            request.send();
            break;
    };
};

//Shows elements
function show( target ) {
    document.getElementById( target ).style.display = 'block';
};

//Hides elements
function hide (target ) {
    document.getElementById( target ).style.display = 'none';
};


//Dinamically creates the feeds table & displays the feeds inside the table
function displayFeeds( feeds, objId="feedsTable" ) {
    var table = document.getElementById( objId );

    while ( table.rows.length > 1 ) {
        table.deleteRow(1);
    }

    feeds = JSON.parse( feeds );

    var body = table.appendChild( document.createElement('tbody') );

    for ( var i = 0; i < feeds.length; i++ ) {
        var select = document.createElement( "select" );
        select.setAttribute( "name", "tableSelect_" + i );
        select.setAttribute( "id", "tableSelect_" +  feeds[i].id );
        select.setAttribute( "class", "selectStyle" );

        var btn = document.createElement( "BUTTON" );   
        btn.innerText = "Change";
        btn.id = "changeBtn";
        btn.dataset.id = feeds[i].id;
        btn.onclick = clickChange;
        
        if ( i==0 ) {
            var header = table.createTHead(i+1);
            var row = header.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = "ID";
            cell2.innerHTML = "Feed url";
            cell3.innerHTML = "Change status";
            cell4.innerHTML = "Fetch RSS feed items";
        }

        var row = body.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = feeds[i].id;
        cell2.innerHTML = feeds[i].url;

        option = document.createElement( "option" );
        option.setAttribute( "value", "active" );
        option.innerHTML = "Active";
        select.appendChild( option );

        option = document.createElement( "option" );
        option.setAttribute( "value", "inactive" );
        option.innerHTML = "Inactive";
        select.appendChild( option );

        option = document.createElement( "option" );
        option.setAttribute( "value", "removed" );
        option.innerHTML = "Removed";
        select.appendChild( option );
        cell3.appendChild( select );
        cell3.appendChild( btn );
        
        var bttn = document.createElement( "BUTTON" );   
        bttn.innerText = "Fetch";
        bttn.classList.add( "fetchTableBtn" );
        bttn.dataset.id = feeds[i].id;
        bttn.onclick = clickFetch;
        bttn.setAttribute( 'type', 'button' );
        cell4.appendChild( bttn );
    };
};

//Dinamically creates the items table & displays the items inside the table
function displayItems( feeds, objId="itemsTable" ) {
    var table = document.getElementById(objId);
    j = 0;
    while ( table.rows.length > 1 ) {
        table.deleteRow(j);
        j++;
      }

    feeds = JSON.parse( feeds );
    var body = table.appendChild( document.createElement('tbody') );

    for ( var i = 0; i < feeds.length; i++ ) {

        if ( i == 0 ) {
            var header = table.createTHead(i+1);
            var row = header.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = "ID";
            cell2.innerHTML = "Fetched item";
        }

        var row = body.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = feeds[i].id;
        cell2.innerHTML = feeds[i].item;
    };
};

function validateUrl( urlString = "" ) {
    var check = false;
    try{
        var link = new URL(urlString);
        check = true;
    }catch(exception){
        check = false;
    }
    return check;
};

//Loads the content before javascript
document.addEventListener( 'DOMContentLoaded', setEvents, false );