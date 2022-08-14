function getBotResponse(input) {
 
    

    var str = "Visit here for more details.";
    var link = str.link("/shop.html");
    var msg = "Hi "+link;

    var linkk = str.link("/contact.html")
    var msgg = "Hi "+linkk;

    var linkkk = str.link("/about.html")
    var msggg = "Hi "+linkkk;


   
    if(input == "contact"){
        return msgg;
    }else if(input == "about"){
        return msggg;
    }

    // Simple responses
    if (input == "hello") {
        return "Hello there!";
    } else if (input == "shop") {
        return msg;
      }  else if(input == ""){
          return "Please type something else.";
        }
     else {
        return "Try asking something else!";
    }


    





}

