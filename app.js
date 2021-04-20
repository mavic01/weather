const express = require('express')
const https = require('https')
const bodyParser = require("body-parser")
const { urlencoded } = require('body-parser')
const ejs = require('ejs')



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


// all we have to do is update this query. btw, this is the url broken down
//now we wanna render d index.html on the browser when d user calls app.get() at the root route
app.get("/", function(req, res){
   res.render('index') 
})

app.post("/weather", function(req, res){
const query = req.body.cityName; /* this will be what ever city name d user enters*/
const apiKey = "8e14288a397029abab76274169a66b84"
const unit = "metric"

const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit
https.get(url, function(response){
    console.log(response.statusCode)// logs the response on the console. .statusCode will print 200 ie. all is good
   
    response.on('data', function(data){ /*Inside the on mtd, we can tap into a specific moment like when we receive a
        data ie. 'data'... and the callback function is gonna contain the data that we get*/
        const weatherData = JSON.parse(data) 
        const temp = weatherData.main.temp //to just d temperature.A neat trick is to go JSON viewer n copy d path of where u wann go
        const weatherDescription = weatherData.weather[0].description
        const icon = weatherData.weather[0].icon// parsing d data n gettin the specific elements dat we want
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        
        res.write("<body style='background-color: crimson; width='100%' >")
        res.write("<p>The temperature in " + query + " is " + temp + " degree Celcius</p>")
        res.write("<h1>The cloud cover is currently made up of " + weatherDescription + ".</h1>")
        res.write("<img src=" +imageUrl +">") // img are self closing tags
        res.write("</body>")
        res.send() // sending it back to the browser using the html dat we wanna write weather[0].icon
        
})

//         // const object = {
//         //     name: "Victor",
//         //     favoriteFood: "mac and cheese"
//         // }
//         // console.log(JSON.stringify(object))
//         /*this logs the data gotten from the weather map API(but data appears as hexidecimal. 
//         Buh u can copy the code, and paste it into a hexidecimal converter(https://cryptii.com/pipes/hex-to-text) to convert it to text)
//         In order not to get a hexidecimal code, convert it to javascript object(JSON.parse())
//         You can also go the other way round using JSONstringify() as seen in const object
        
//         To get specific items from the API printed out on ur site, const temp = weatherData.main.temp
//         In order to pass the data back into our app.get(), we have to tap into our res(res that our server is gonna send back to the client's browser)
//         in this case, the response can just be the data that we get back ie. res.send(temp)
//         NB: we can only have just 1 res.send() in any given app.get() method. But we can hv multiple res.write()

//         we can always wrap html tags in res.send and res.write, So u can write multiple lines of html by using
//         a combination of res.write() and res.send()

//         To add an image, we have to go back to the API to check the list of condition codes.The weather 
//         condition codes are the ID of the weather and they correspond to different wx conditions and we 
//         also get back an icon(eg.10d) which corresponds to the weather condition as an image. just copy the link and include the icon name ie. 10d etc. see link http://openweathermap.org/img/wn/10d@2x.png
//         */
//     })

});
});






/*know more about http - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status. 404 when the http get request api link isnt correct
 The open weather map server is basically telling us dat this resource ya looking for at this path doesn't exist
 401(Unauthorized http request) - occurs when u make a mistake with the app ID
*/
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
});
/*instead of sending just "Server is up and running", lets make a Get request to the open weather map API's server
and to be able to fetch the data back as a JSON and parse it, so that i get the relavant piece of information
(Google: make get request to external server with node) - on stack overflow, it points to a package called request 
module(now deprecated tho as of 2020). This blog https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
however shows us 5 ways of achieving this, the last 4 being external npm packages, just the Https module is native.
see how to do it here: https://nodejs.org/api/https.html#https_https_get_url_options_callback*/
