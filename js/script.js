var g_name="";

$("#searchForm").submit(function(e){

	g_name = $("input[name='in_name']").val();
	//console.log(g_name);

	getPerson(g_name);
	e.preventDefault();
});


//data structure to store data
var person = {
    name: "monet",
    birthplace: "Paris, France",
    culture: "French",
    datebegin: "1840",
    dateend: "1926"
};

var work = [
    // {
    //     url: "http://nrs.harvard.edu/urn-3:HUAM:30366_dynmc",
    //     title: "Gorge of the petit Ailly, Varengeville",
    //     classification: "Paintings",
    //     medium: "oil on canvas",
    //     date: "1897"
    // }        
];

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
    
        console.log("person information:");
        console.log(result);

        var personid = result.records[0].personid;
        //console.log("personid: " + personid);
        //put person information into data structure
        person.name = result.records[0].alphasort;
        person.birthplace = result.records[0].birthplace;
        person.culture = result.records[0].culture;
        person.datebegin = result.records[0].databegin;
        person.dateend = result.records[0].dateend;

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
    
        console.log("art information:");
        console.log(result);

        var records = result.records;
        var imgUrls = [];

        // for(var i = 0; i < records.length; i++){
        //     imgUrls.push(records[i].images[0].baseimageurl);
        // }
        // console.log(imgUrls);

        //put art work information into data structure
        work = [];

        for(var i = 0; i < 3; i++){
            console.log(i);
            var tmp = {};
            tmp["url"] = result.records[i].images[0].baseimageurl;
            tmp["title"] = result.records[i].title;
            tmp["classification"] = result.records[i].classification;
            tmp["medium"] = result.records[i].medium;
            tmp["date"] = result.records[i].dated;
            
            work.push(tmp);
        }

        display(person, work);

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

//-----------------------------------------------------------------------------------------
// function display
//
//-----------------------------------------------------------------------------------------
function display(person, work){

    //clear previous display
    $("section#portrait .bio_template").remove();
    $("section#paintings ul").html(" ");
    //display portrait 
    var porElem = $("#template div.bio_template").clone();
    console.log(porElem);
    porElem.find("p.name").html(person.name);
    porElem.find("p.birthplace").html(person.birthplace);
    porElem.find("p.date").html(person.datebegin+"-"+person.dateend);

    
    $("section#portrait").append(porElem);

    //display paintings
    for(var i = 0; i < work.length; i++){
        var paintElem = $("#template div.paint_template").clone();
       
        console.log(paintElem);
        paintElem.find("img").attr("src", work[i].url);
        paintElem.find("p.title").html(work[i].title);
        paintElem.find("p.medium").html(work[i].medium);
        paintElem.find("p.pdate").html(work[i].date);


        $("section#paintings ul").append("<li></li>");
        $("section#paintings ul li:last-child").append(paintElem);   
    }

}












