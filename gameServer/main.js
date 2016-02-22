var localStorage = require('localStorage');

var ip   = "192.168.0.103",
    port = 1337,
    http = require('http'),
    url = require("url"),
    path = require("path");

// for testing purpuse: 
// clear stats for each server starts	
//
localStorage.clear();
console.log ('LS: ' + localStorage.length);

function onRequest(request, response) {
    
	 // console.log(request.method);
     // console.log(request.headers);
     // console.log(request.url);

    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    var queryData = url.parse(request.url, true).query;
    console.log("query data ", queryData);

    // ROUTE: api
    if(pathname == "/api"){
	    var argv = queryData && queryData["argv"] || "";

		// compute running average ...
		var aveStr = localStorage.getItem ('runAve');
		var average;
		if (aveStr === null) 
			average = {n: 0, ave: 0};
		else
			average = JSON.parse (aveStr);
	
		// gotcha!
		average.ave = (Number(average.ave * average.n) + Number(argv))/(Number(average.n)+1);
		average.n++;
		localStorage.setItem ('runAve', JSON.stringify (average) );
		
		// response without shelljs
          var outputObj = {
          	status: 1,
          	output: average.n +', ' + average.ave
          };

	      /*
            The response header for supporting CORS:
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
          */

		  response.writeHead(200, {
		  	"Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
		  });


		  response.write(JSON.stringify(outputObj));
		  response.end();
		
	}
    // ROUTE: 404
	else {
		response.writeHead(200);
		response.write("404 Not Found\n");
		response.end();
	}
  
}
http.createServer(onRequest).listen(port, ip);
console.log("Server has started: http://"+ip+":"+port);