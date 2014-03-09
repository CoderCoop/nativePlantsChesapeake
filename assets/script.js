$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault(); // supress form submit
        
        $('#mydiv').empty(); // clear old results
        
        $('#mydiv').html('<img src="http://preloaders.net/preloaders/712/Floating%20rays.gif"/>Loading...'); // show loading message
        
        // console.clear();
        var input = $('#query').val();
        var api = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.nativeplantcenter.net%2F%3Fq%3Ddatabase%26startIndex%3D0%26keyword%3D" + input + "%22%20and%20xpath%3D'%2F%2Fdiv%5Bcontains(%40class%2C%22database_entry%20matrix_entry%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?";
        $.getJSON(api, {
            //    tags: "mount rainier",
            //    tagmode: "any",
            //    format: "json"
        })
        .done(function (data) {
      
        $('#mydiv').empty(); // clear loading message
      
          var mydata = new Array();
          
          $.each(data.query.results.div, function (i, div) {
          
            var entry = new Array();
          
            entry["url"]=div.div[0].a.href; //plant url
            entry["img"]=div.div[0].a.img.src; //thumbnail image
            entry["term"]=div.div[1].a.content; //scientific name
            entry["name"]=div.div[2].p; //common name  
            
            plantid = "plant"+entry["url"].split("/").pop(); 
 
            mydata.push(entry);
            
            //create div for thumbnail
            $imagediv = $('<div>', {class:'div-table-cell div'}); 
            $( "<img>", {class:'thumbnail'}).attr( "src", entry["img"] ).prependTo( $imagediv );
            $rowdiv.append($imagediv);
            
            // create div with name
            $namediv = $('<div>', {class:'div-table-cell div-title',text:entry["name"]}); 
            $rowdiv = $('<div>', {class:'div-table-row'}); //create div for row
            $rowdiv.append($namediv);
                      
            // append row to main div
            $('#mydiv').append($rowdiv);
      });
    });
  });
});
