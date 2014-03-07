$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        console.clear();
        var input = $('#query').val();
        var api = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.nativeplantcenter.net%2F%3Fq%3Ddatabase%26startIndex%3D0%26keyword%3D" + input + "%22%20and%20xpath%3D'%2F%2Fdiv%5Bcontains(%40class%2C%22database_entry%20matrix_entry%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?";
        $.getJSON(api, {
            //    tags: "mount rainier",
            //    tagmode: "any",
            //    format: "json"
        })
            .done(function (data) {
                $.each(data.query.results.div, function (i, div) {
                        console.log(div.div[0].a.href);
                        console.log(div.div[0].a.img.src);
                        console.log(div.div[1].a.content);
                        console.log(div.div[2].p);
                        // html += "<div>"+div.class+"</div>";     
                    }
                    //$('#mydiv').append(html);
                );
            });
    });
});
