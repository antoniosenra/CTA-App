//This sends the request to the API. I used an "ajax" method. This allowed me to avoid the issue where the browser cached one API response, and kept giving that response for every one of my API requests.  

function updatePrediction() {
  
$.ajax({cache: false, url: "https://crossorigin.me/http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=Usu4cNEP6JE8nKfVHmpcezeJq&stpid=17057&format=json", success: function(data) {

//The CTA API produces error messages when the bus(es) in question isn't within operating hours. These variables will be used in a conditional that accounts for CTA's operating hours.
  
    var now = new Date(),
        day = now.getDay(),
        hour = now.getHours(),
        minutes = now.getMinutes();

//This console log shows me the current date information and helps me check whether I've made a mistake in the rather complex conditional below. In other words, it allows me to double check my work.
      
    console.log("Day: " + day + " Hour: " + hour + " Minutes " +  minutes);

//This is the conditional. The CTA's operating hours are: weekdays from 7:00 am to 6:15 pm and weekends from 8:00 am to 6:20 pm.
  
    if ((day >= 1 && day <= 6 && ((hour >= 7 && hour <= 18) || (hour == 18 && minutes <= 15))) || (((day == 0) || (day == 7)) && ((hour >= 8 && hour <= 18) || (hour == 18 && minutes <= 20)))) {
 
//This creates the variables that I will use for key functions below.
  
        var timeRemaining1 = data["bustime-response"].prd[0].prdctdn,
            bus1 = data["bustime-response"].prd[0].rt,
            alert1 = function() {
                alert('The ' + bus1 + ' is less than three minutes away!');
            },
			alert2 = function() {
				alert('The ' + bus1 + ' is ' + timeRemaining1 + ' minutes away!');
			};

//Double checking my work.
      
        console.log(data);
        console.log('The closest bus is the ' + bus1 + ', and it is ' + timeRemaining1 + ' minutes away.');
        console.log("Is timeRemaining1 a number? " + !isNaN(timeRemaining1));
 
//These are the more important functions that happen if the condition is satisfied.
      
        if (timeRemaining1=="DUE") //This isn't in the API documentation, but after observing the CTA API, it seems to me like whenever a bus is less than three minutes away, the API response to prdctdn is "DUE," rather than a number.
        { 
            $('#TimeRemaining').text('The ' + bus1 + ' is less than three minutes away!'); 
            alert1();
            console.log('Alert1 was triggered');
          
        } else if (!isNaN(timeRemaining1)) //This condition requires that prdctdn return a number. See the "else" below for why.
        {
            $('#TimeRemaining').text('The ' + bus1 + ' is ' + timeRemaining1 + ' minutes away.')
            console.log('Alert1 was not triggered.');
            if (timeRemaining1 <= 5)
             {
                alert2();
                console.log('Alert2 was triggered.');
            } else {
                console.log('Alert2 was not triggered.');
            }
        } else {
            $('#TimeRemaining').text('We apologize, but CTA is having some technical issues. Please try again in a few minutes.') //It seems to me that if prdctdn is not returning a number or a "DUE," then there's some bug. 
        }
    
//This final "else" is for when the buses for the law school stop are outside of operating hours. The else function is to show an error message in html.
      
    } else {
        $('#TimeRemaining').text("It is currently outside of CTA operating hours. Please try again on a weekday from 7:00 am to 6:15 pm or on a weekend from 8:00 am to 6:20 pm")
        console.log("The buses are currently outside of operating hours. Here's what the API response is showing: ");
        console.log(data["bustime-response"]);
    };
}})
};

//Without this "setTimeout," my code wouldn't start running until after the first interval elapsed (i.e., 30 seconds). If I tried to call the function WITHOUT a setTimeout, I would get a "ReferenceError" on the "$." Using setTimeout avoided these two issues.

setTimeout(updatePrediction, 1000);

setInterval(updatePrediction, 30000);

//test
//test2