var req;
var isIE;
var completeField;
var completeTable;
var autoRow;

function init() {
	
    completeField = document.getElementById("searchId");
    completeTable = document.getElementById("complete-table");
    autoRow = document.getElementById("auto-row");
  
}

function doCompletion() {
	
    var url = "http://localhost:8999/A2/autocomplete?action=complete&id="+ escape(completeField.value);
    req = initRequest();
    req.open("GET", url, true);
    req.onreadystatechange = callback;
    req.send(null);
}
function initRequest() {
	
   var xmlHttpReq;
  // to create XMLHttpRequest object in non-Microsoft browsers
  if (window.XMLHttpRequest) {
    xmlHttpReq = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      //to create XMLHttpRequest object in later versions of Internet Explorer
      xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (exp1) {
      try {
        //to create XMLHttpRequest object in later versions of Internet Explorer
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (exp2) {
        //xmlHttpReq = false;
        
      }
    }
  }
  return xmlHttpReq;
}

function callback() {
	
    clearTable();

    if (req.readyState == 4) {
        if (req.status == 200) {
		
            parseMessages(req.responseXML);
        }
    }
}
function clearTable() {
    if (completeTable.getElementsByTagName("tr").length > 0) {
        completeTable.style.display = 'none';
        for (loop = completeTable.childNodes.length -1; loop >= 0 ; loop--) {
            completeTable.removeChild(completeTable.childNodes[loop]);
        }
    }
}


function appendProduct(productName,productId) {

    var row;
    var cell;
    var linkElement;
    
    if (isIE) {
        completeTable.style.display = 'block';
        row = completeTable.insertRow(completeTable.rows.length);
        cell = row.insertCell(0);
    } else {
        completeTable.style.display = 'table';
        row = document.createElement("tr");
        cell = document.createElement("td");
	cell.style.color = "magenta";
        row.appendChild(cell);
        completeTable.appendChild(row);
    }

    cell.className = "popupCell";

    linkElement = document.createElement("a");
    linkElement.className = "popupItem";
    linkElement.setAttribute("href", "autocomplete?action=lookup&id=" + productId);
    linkElement.appendChild(document.createTextNode(productName));
    cell.appendChild(linkElement);
}


function parseMessages(responseXML) {
   
    // no matches returned
    if (responseXML == null) {
        return false;
    } else {

        var products = responseXML.getElementsByTagName("products")[0];

        if (products.childNodes.length > 0) {
            completeTable.setAttribute("bordercolor", "black");
            completeTable.setAttribute("border", "1");
   
            for (loop = 0; loop <  products.childNodes.length; loop++) {
		      
                var product = products.childNodes[loop];
                var productName = product.getElementsByTagName("productName")[0];
                var productId = product.getElementsByTagName("id")[0];
             
                appendProduct(productName.childNodes[0].nodeValue,
                    productId.childNodes[0].nodeValue);
                    
            }
        }
    }
}