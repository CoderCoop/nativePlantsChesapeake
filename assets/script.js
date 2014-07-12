$(document).ready(function () {   
   
  var mydata; // create array to hold result data
       
  // search form
  $("form").on("submit", function (e) {

//    var $form = $(this);
//    var id = $form.attr('id');

    console.log(this.id);

    $.mobile.changePage('#search-results');

    // jqm loading widget
    $.mobile.loading( 'show', {
      text: "Loading...",
      textVisible: true,
      theme: "b",
    });

    
    e.preventDefault(); // suppress form submit
    
    mydata = new Array(); // initialize with new array
   
    $('#mylist').empty(); // clear old results from dom

    // detect which search bar from either jqm page was used and sync input
    if (this.id == "forma") {
      var input = $('#querya').val(); // get search input from forma querya
      $("#queryb").val(input); // sync querya to queryb
    }
    else {
      var input = $('#queryb').val(); // get search input from formb queryb
      $("#querya").val(input); // sync queryb to querya
    }

    
    // build yql & nativeplantcenter query
    var api = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.nativeplantcenter.net%2F%3Fq%3Ddatabase%26count%3D-1%26keyword%3D" + input + "%22%20and%20xpath%3D'%2F%2Fdiv%5Bcontains(%40class%2C%22database_entry%20matrix_entry%22)%5D'&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?";

    // run jquery function
    $.getJSON(api, {
      format: "json"
    })
    
    // runs when $.getJSON() completes 
    .done(function (data) {
  
      // handle case of 0 results found
      if (!data.query.results) {
        $('#mylist').html("<h3>No results found.</h3>");
        $.mobile.loading( 'hide');
        return;
      }   
        
      // handle case of only 1 result returned     
      if (typeof data.query.results.div[0] === 'undefined') {  
        data.query.results.div = new Array(data.query.results.div);
      }
      
      //iterate through each result          
      $.each(data.query.results.div, function (i, div) {
        
        // create array to hold result data
        var entry = new Array();
        
        // assign values from json
        entry["url"]=div.div[3].div.div[0].a.href; //plant url
        entry["thumb"]=div.div[0].a.img.src; //thumbnail image
        entry["img"]=entry["thumb"].replace("thumbs/",""); //full size image  
        entry["species"]=div.div[1].a.content; //scientific name
        entry["name"]=div.div[2].p; //common name  
        entry["commonNames"]=div.div[3].div.div[1].p.content; // all common names
        entry["plantTypes"]=div.div[3].div.div[2].p; // plant types
        entry["sunExposure"]=div.div[3].div.div[3].p; // sun exposure
        entry["soilTexture"]=div.div[3].div.div[4].p; // soil texture
        entry["soilMoisture"]=div.div[3].div.div[5].p; // soil moisture
        entry["region"]=div.div[3].div.div[6].p; // region
        
        
        // extract numeric plant id from url
        plantid = entry["url"].split("/").pop(); 
        
        //remove leading punctuation
        for (var x in entry) {
          entry[x] = entry[x].replace(":  ","");
          entry[x] = entry[x].replace(": ","");
        }      

        // save entry into mydata array
        mydata[plantid]=entry;
        
        //create li
        $listitem = $('<li>'); 
        
        //create link
        $itemlink = $('<a>').attr({
          "href":"#details-page",
          "class":"search-result",
          "id":plantid,
          "data-transition":"slide"
        }); 
        
        //create thumbnail image
        $( "<img>").attr( "src", entry["thumb"] ).appendTo( $itemlink );
        
        // create html element with species name
        $('<h3>', {text:entry["species"]}).appendTo( $itemlink ); 

        // create html element with name
        $('<p>', {text:entry["name"]+entry["commonNames"]}).appendTo( $itemlink );
 
        // create html element plant type
        $('<p>', {
          text:"Plant Type: "+entry["plantTypes"],
          style:"font-style:italic"
        }).appendTo( $itemlink );
          
        // append link to list item
        $itemlink.appendTo($listitem);   
                  
        // append row to main list
        $('#mylist').append($listitem);
        
        // trigger jquery mobile with newly built list
        $("#mylist").listview("refresh");
        
        // remove loading message
        $.mobile.loading( 'hide');
        
      });
    });
  });


  // catch click on search results to show detailed page
  $(document).on('click', 'a.search-result', function() {
  
//    console.log("foo");

//    $.mobile.changePage('#details-page');

//    console.log("bar");

    // clear old results
    $('#entry-detail-a').empty();
    $('#entry-detail-b').empty();
    
    // remove old popup divs
    $('.ui-popup-container').remove(); 
    $('.ui-popup-screen').remove(); 
  
    // get current plant id from <a id="">
    var myplant = $(this).attr('id'); 
 
    // display plant species name
    $('#entry-detail>h3').text(mydata[myplant].species); 
    
    // create popup link
    $imagelink= $('<a>').attr({
      "href":"#myPopup"+myplant,
      "data-rel":"popup",
      "data-position-to":"window"
    }); 
    
    // add image inside popup link
    $imagelink.append($('<img>').attr({
      "src":mydata[myplant].img ,
      "class":"bigimage"
    }));
    
    // add image and link to trigger popup
    $('#entry-detail-a').append($imagelink);
    
    
    // create div to hold popup image
    $popupdiv = $('<div>').attr({
      "data-role":"popup",
      "id":"myPopup"+myplant,
      "class":"photopopup",
      "data-overlay-theme":"b"
    });
    
    //add close button to popup div
    $popupdiv.append($('<a>').attr({
      "href":"#",
      "data-rel":"back",
      "class":"ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right",
    }));

    // add popup image to div
    $popupdiv.append($('<img>').attr({
      "src": mydata[myplant].img,
    }));
    
    // add the popup div
    $('#entry-detail-a').append($popupdiv);
    
    // call popup function because dom has been modified
    $( "#myPopup"+myplant ).popup();

    // popup image scaling http://demos.jquerymobile.com/1.4.2/popup-image-scaling/    
    $( ".photopopup" ).on({
      popupbeforeposition: function() {
        var maxHeight = $( window ).height() - 60 + "px";
        $( ".photopopup img" ).css( "max-height", maxHeight );
        //console.log("maxHeight: "+maxHeight);
      }
    });
    
    // entry details plant info
    $('#entry-detail-b').append(
      $('<div>').html('Common Names: <span>'+mydata[myplant].name+mydata[myplant].commonNames+"</div>"),
      $('<div>').html('Plant Type: <span>'+mydata[myplant].plantTypes+"</div>"),
      $('<div>').html('Sun Exposure: <span>'+mydata[myplant].sunExposure+"</div>"),
      $('<div>').html('Soil Texture: <span>'+mydata[myplant].soilTexture+"</div>"),
      $('<div>').html('Soil Moisture: <span>'+mydata[myplant].soilMoisture+"</div>"),
      $('<div>').html('Region: <span>'+mydata[myplant].region+"</div>"),
      $('<div>').html('<a id="learn-more" class="ui-btn ui-corner-all ui-shadow ui-btn-icon-right ui-icon-arrow-u-r" href="'+mydata[myplant].url+'">Learn More</a>')
    );
  }); // close function handler for search results detail

  // catch click on sample search
  $(document).on('click', 'a.sample-search', function() {
    // get sample search from <a href="">
    var ssearch = $(this).text();
    console.log(ssearch);
    $("#querya").val(ssearch);
    $("#querya").submit();
  }
);


}); //close document.ready function

