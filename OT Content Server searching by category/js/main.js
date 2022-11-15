//varibles to handle data
let otcsTiket, userValue, passVlue, data, searchResponse, headersParameters, category,wordValue;



//login function
function login(){
    //featch user name and password typed in the form
    userValue = document.getElementById("username").value;
    passVlue = document.getElementById("password").value;
    // collect data object
    data = {
        "username": userValue,
        "password": passVlue
    };

    //form the body of request
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    //generate token API fetch
    fetch('http://localhost/OTCS/cs.exe/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
    //response and save the ticket in variable to use it in the other API
    .then(res => res.json())
    .then(data => {
        obj = data;
        console.log(obj);
        otcsTiket = JSON.stringify(obj.ticket).replace(/"/g,"");
        document.getElementById("result").value = otcsTiket;
        console.log(otcsTiket);
    })

}


//search function
function search(){
    //featch user name and password typed in the form
    wordValue = document.getElementById("keyword").value;
    category = document.getElementById("category").value;
   
    //request header
    headersParameters = new Headers();
    headersParameters.append("OTCSTicket", otcsTiket);
    headersParameters.append("Content-Type", "application/x-www-form-urlencoded");
    
    // collect data object
    data = {
        "where": 'OTSubType : 144 & OTDCategory : '+category+' & '+ wordValue,
        "within": 'metadata'
    };
    

    //form the body of request
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    //generate token API fetch
    fetch('http://localhost/OTCS/cs.exe/api/v2/search', {
      method: 'POST',
      headers: headersParameters,
      body: formBody,
      redirect: 'follow'
    })
    //response and save the ticket in variable to use it in the other API
    .then(res => res.json())
    .then(data => {
        obj = data;
        var arr = [];
        var len = obj.results.length;
        //get the related segment from response JSON
        obj.results.forEach(element => {
            console.log(element.data.properties.name);
            console.log(element.data.properties["id"]);
            arr.push({
                DocId: element.data.properties["id"],
                DocName: element.data.properties.name
            })
        });
        //add the result to the tesxt area
        var textarea = document.getElementById('searchresult');
        textarea.value = "";
        var counter = 1;
        for(var x = 0; x < arr.length; x++){
            textarea.value += "Item Number: " + counter;
            textarea.value += "\t";
            textarea.value += "Document ID: " + arr[x].DocId;
            textarea.value += "\t";
            textarea.value += "Document name:"+ arr[x].DocName;
            textarea.value += "\n";
            textarea.value += "-------------------------------------------------------------";
            textarea.value += "\n";
            counter++
        }

    
    })

}




    
    
    