


$(document).ready(function () {
   
        var mydata; // create array to hold result data
       
// search form
  $("form").on("submit", function (e) {
        e.preventDefault(); // suppress form submit
        
        mydata = new Array(); // initialize with new array
       
        $('#mylist').empty(); // clear old results
        
        $('#mylist').html('<img src="http://preloaders.net/preloaders/712/Floating%20rays.gif"/>Loading...'); // show loading message
        
        // console.clear();
        var input = $('#query').val();
        var api = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.nativeplantcenter.net%2F%3Fq%3Ddatabase%26count%3D-1%26keyword%3D" + input + "%22%20and%20xpath%3D'%2F%2Fdiv%5Bcontains(%40class%2C%22database_entry%20matrix_entry%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?";
        $.getJSON(api, {
            //    tags: "mount rainier",
            //    tagmode: "any",
            //    format: "json"
        })
        .done(function (data) {
      
        $('#mylist').empty(); // clear loading message
      
          
          
          $.each(data.query.results.div, function (i, div) {
          
          //console.log(div);
          
            var entry = new Array();
          
            entry["url"]=div.div[0].a.href; //plant url
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
            
            // create html element with name
            $name = $('<h3>', {text:entry["name"]}).appendTo( $itemlink ); 

            // create html element with species name
            $species = $('<p>', {text:entry["species"]}).appendTo( $itemlink );
              
            // append link to list item
            $itemlink.appendTo($listitem);   
                      
            // append row to main list
            $('#mylist').append($listitem);
            
            // trigger jquery mobile with newly built list
            $("#mylist").listview("refresh");
            
            
            
      });
    });
  });

  $(document).on('click', 'a.search-result', function() {
  
    $('#entry-detail').empty(); // clear old results
    $('#myPopup').empty(); // clear old results
  
    var myplant = $(this).attr('id'); //current plant id
    
    console.log(myplant);
    
    $('#entry-detail').append($('<h3>').text(mydata[myplant].name));
    
    // create image popup link
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
    
    // popup link
    $('#entry-detail').append($imagelink);
    
    // create div to hold popup image
    $popupdiv = $('<div>').attr({
      "data-role":"popup",
      "id":"myPopup"+myplant,
      "class":"photopopup",
    });
    
    $popupdiv.append($('<img>').attr({
      "src": mydata[myplant].img,
    
    }));
    
    $('#entry-detail').append($popupdiv);
    
    // call popup function
    $( "#myPopup"+myplant ).popup();

  });
  
  $( document ).on( "pagecreate", function() {
     // console.log("foo");
      $( ".photopopup" ).on({
          popupbeforeposition: function() {
              var maxHeight = $( window ).height() - 60 + "px";
              $( ".photopopup img" ).css( "max-height", maxHeight );
          }
      });
  });

  
  
});






