var g_name="";

$("#searchForm").submit(function(e){

	g_name = $("input[name='in_name']").val();
	//console.log(g_name);

	getPerson(g_name);
	e.preventDefault();
})

//-----------------------------------------------------------------------------------------
// function getPerson
//
//-----------------------------------------------------------------------------------------
function getPerson(displayname) {
    var request = {
        q : displayname,
        type : 'displayname',
        apikey : "309fd7f0-e667-11e5-9ff0-1f52d2bcd26a"
    };

    $.ajax({
        url: "http://api.harvardartmuseums.org/person",
        data: request,
        dataType: "json",
        type: "GET"
    })
    .done(function(result){
    
        //console.log(result);

        var personid = result.records[0].personid;
        //console.log("personid: " + personid);

        getArtwork(personid, "Paintings");

    })
    .fail(errorHandler);
}

//-----------------------------------------------------------------------------------------
// function getArtwork
//
//-----------------------------------------------------------------------------------------
function getArtwork(pid, workType){
    var request = {
        person: pid,
        classification: workType,
        apikey : "309fd7f0-e667-11e5-9ff0-1f52d2bcd26a"
    };

    $.ajax({
        url: "http://api.harvardartmuseums.org/object",
        data: request,
        dataType: "json",
        type: "GET"
    })
    .done(function(result){
    
        console.log("returned object:")
        console.log(result);

        var records = result.records;
        var imgUrls = [];

        for(var i = 0; i < records.length; i++){
            imgUrls.push(records[i].images[0].baseimageurl);
        }
        console.log(imgUrls);

    })
    .fail(errorHandler);
}

//-----------------------------------------------------------------------------------------
// function errorHandler
//
//-----------------------------------------------------------------------------------------
function errorHandler(jqXHR, exception) {

    if (jqXHR.status === 0) {
        console.log('Not connected.\nPlease verify your network connection.');
    } else if (jqXHR.status == 404) {
        console.log('The requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        console.log('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        console.log('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        console.log('Time out error.');
    } else if (exception === 'abort') {
        console.log('Ajax request aborted.');
    } else {
        console.log('Uncaught Error.\n' + jqXHR.responseText);
    }
}