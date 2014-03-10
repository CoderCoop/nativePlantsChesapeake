$(document).ready(function () {
  $("form").on("submit", function (e) {
        e.preventDefault(); // supress form submit
        
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
      
          var mydata = new Array();
          
          $.each(data.query.results.div, function (i, div) {
          
          console.log(div);
          
            var entry = new Array();
          
            entry["url"]=div.div[0].a.href; //plant url
            entry["img"]=div.div[0].a.img.src; //thumbnail image
            entry["species"]=div.div[1].a.content; //scientific name
            entry["name"]=div.div[2].p; //common name  
            entry["commonNames"]=div.div[3].div.div[1].p.content; // all common names
            entry["plantTypes"]=div.div[3].div.div[2].p; // plant types
            entry["sunExposure"]=div.div[3].div.div[3].p; // sun exposure
            entry["soilTexture"]=div.div[3].div.div[4].p; // soil texture
            entry["soilMoisture"]=div.div[3].div.div[5].p; // soil moisture
            entry["region"]=div.div[3].div.div[6].p; // region
            
            
            // extract numeric plant id from url
            plantid = "plant"+entry["url"].split("/").pop(); 
 
            mydata.push(entry);
            
            //create li
            $listitem = $('<li>'); 
            
            //create link
            $itemlink = $('<a>').attr("href","#"+plantid); 
            
            //create thumbnail
            $( "<img>").attr( "src", entry["img"] ).appendTo( $itemlink );
            
            // create element with name
            $name = $('<h3>', {text:entry["name"]}).appendTo( $itemlink ); 

            // create element with species name
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
});
