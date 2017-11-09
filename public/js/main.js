$(document).ready(function(){
    $("#login-button").click(function(e){
        e.preventDefault();
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        var formData = {
            username : username,
            password: password
        }
        console.log(formData);
        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/users/login', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,
            success: function(data){
                console.log(data);
                $("#login-block").css("display","none");
                $("#adminhome").css("display","block");
            }
        })
    });
});
