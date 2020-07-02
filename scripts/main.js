$(document).ready(function(){
    var today= new Date;
    var xhr = new XMLHttpRequest();
    $("#date-display").text(today.getFullYear());
    $('#msg-div').hide();
    $('#success-msg').hide();
    $('#error-msg').hide();
    $('#view-a-section').hide();
    $('#section-update-question').hide();
   
 

    $('#reg-form-btn').click(function(){
       addUser(); 
    });
    $('#add-question-btn').click(function(){
        addQuestion();   
    });
    $("#login-btn").click(function(){
        login();
    });
    $("#view-a-question-btn").click(function(){
        viewAQuestion();
    });
    $('#update-question-btn').click(function(){
        updateQuestion();
    });

//function to add user to database
    function addUser(){
        var email=$('#email').val();
        var userName=$('#player-name').val();
        var password=$('#password').val();
        var emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(userName=="" ){
            alert("Name  required") 
        }else if(email==""){
            alert('Email address required');
        }else if(password==""){
            alert('password required');

         }else if(!email.match(emailRegExp)){
             alert('Email address entered not valid ');
             email.focus();
        }
        else{

           $.ajax({
                url: 'https://profchiso.github.io/quiz-game/users',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify( { "player-name": userName, "email": email, "password":password } ),
                success: function(){
                    var sms="  your registration is successful";
                   alert(userName +sms );
                   window.location.assign("https://profchiso.github.io/quiz-game/../index.html");
                },
                error: function(){
                    alert('Error Submitting your data');
                }
            });
        }
    }
//end of function to add user 

//function to add question to database
    function addQuestion(){
        var question=$('#question').val();
        var optionA=$('#A').val().toUpperCase();
        var optionB=$('#B').val().toUpperCase();
        var optionC=$('#C').val().toUpperCase();
        var optionD=$('#D').val().toUpperCase();
        var answer=$('#answer').val().toUpperCase();

        if(question != "" && optionA != "" && optionB != "" && optionC != "" && optionD !="" && answer !="" ){

            if(answer=='A' || answer=='B'  || answer=='C' || answer=='D'){
                $.ajax({
                    url: 'https://profchiso.github.io/quiz-game/questions',
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( { "question": question, "optionA": optionA, "optionB":optionB , "optionC":optionC , "optionD":optionD, "answer":answer } ),
                    success: function(){
                        var sms=" Question is successfully added";
                         alert(sms );
                        window.location.assign("https://profchiso.github.io/quiz-game/pages/actions.html");
                        
                        
                        $('#success-msg').text("Question is successfully added");
                        $('#success-msg').show().fadeOut(400);
                       

                             },
                   error: function(){
                         alert('Error Submitting your question');
                        }
                });
            }else{
                alert('Only letter A,B,C,D are allowed in the answer field');
            }
        }else{
            alert("All filleds are Required")
        }
    }
//end of function to add question

//function login
 function login(){
    var xhr = new XMLHttpRequest();
    var username=$('#login-email').val();
    var password=$('#login-password').val(); 
    if(username==""){
        alert('Email required');
    }else if(password==""){
        alert('password required');
    }else{
    xhr.open('GET', 'https://profchiso.github.io/quiz-game/users', true);
    xhr.onload = function() {
        if(this.status == 200){
            var users = JSON.parse(this.responseText);
            for (var i in users){
                if(users[i].email==username && users[i].password==password){
                    window.location.assign("https://profchiso.github.io/quiz-game/pages/quiz.html");
                
             }else{
                $('#msg-div').show();
                $("#login-msg").text("Incorrect username and password combination");
                $("#msg-div").show().fadeOut(4000);

            }
        }
        }
    }
    xhr.send();
}
}
})
//end of function login

//function to view a questions from db
function viewAQuestion(){
    $("#error-msg").hide();
    var qid=$('#question-id').val();
    xhr.open('GET', 'https://profchiso.github.io/quiz-game/questions', true);
    xhr.onload = function() {
        if(this.status == 200){
            var questions = JSON.parse(this.responseText);
            var output = '';
            var qid=$('#question-id').val();
            for (var i in questions){
                if(questions[i].id==qid){
                    $('#view-questions-section').hide();
                    $('#view-a-section').show();
                   
                output += 
                `<tr>
                <td>`+questions[i].id+`</td>
                <td>`+questions[i].question+`</td>
                <td>`+questions[i].optionA+`</td>
                <td>`+questions[i].optionB+`</td>
                <td>`+questions[i].optionC+`</td>
                <td>`+questions[i].optionD+`</td>
                <td>`+questions[i].answer+`</td>
            </tr>
            `
            }//else{
                //alert(`No question with ID ${qid}`)
            //}
        }
        
            document.getElementById('populateA').innerHTML = output;
        }
    }
    xhr.send();
}
 // end of function to view a questions from db

//function to delete question from the database
 function deleteQuestion(e){
     var beSure=window.confirm(`Do you really want to delete Question ${e}?`)
     if(beSure){
    $.ajax({
        url:"https://profchiso.github.io/quiz-game/"+e,
        dataType:"json",
        type:'DELETE',     
        success:function(){
          alert(`question ${e} deleted`);
         window.location.assign('https://profchiso.github.io/quiz-game/pages/actions.html');
      }
    }); 
}else{

}
 }
 // End function to delete question from the database

 //function fetch question for update
function fetchQuestion(e){
    var Uquestion=$('#Uquestion');
    var optionA=$('#UA');
    var optionB=$('#UB');
    var optionC=$('#UC');
    var optionD=$('#UD');
    var answer=$('#Uanswer');
    var questionId=$('#questionId');
    var qid=e
    xhr.open('GET', 'https://profchiso.github.io/quiz-game/questions', true);
    xhr.onload = function() {
        if(this.status == 200){
            var questions = JSON.parse(this.responseText);
            for (var i in questions){

             if(questions[i].id==qid){

                questionId.val(questions[i].id);
                Uquestion.val(questions[i].question);
               optionA.val(questions[i].optionA);
              optionB.val (questions[i].optionB);
               optionC.val(questions[i].optionC) ;
              optionD.val( questions[i].optionD) ;
               answer.val(questions[i].answer) ;
               Uquestion.focus();
            }
        }
        }
    }
    xhr.send();
    $('#section-add-update-question').hide();
    $('#section-update-question').show().fadeIn(500);   
   
}
 //end of function fetch  question for update

 function updateQuestion(){
        var id=$('#questionId').val();
        var question=$('#Uquestion').val();
        var optionA=$('#UA').val();
        var optionB=$('#UB').val();
        var optionC=$('#UC').val();
        var optionD=$('#UD').val();
        var answer=$('#Uanswer').val().toUpperCase();

        if(question != "" && optionA != "" && optionB != "" && optionC != "" && optionD !="" && answer !="" ){

            if(answer=='A' || answer=='B'  || answer=='C' || answer=='D'){
                $.ajax({
                    url: 'https://profchiso.github.io/quiz-game/'+id,
                    dataType: 'json',
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify( { "question": question, "optionA": optionA, "optionB":optionB , "optionC":optionC , "optionD":optionD, "answer":answer } ),
                    success: function(){
                        var sms=` Question ${id} successfully updated`;
                         alert(sms );
                        window.location.assign("https://profchiso.github.io/quiz-game/pages/actions.html");
                        
                        
                        

                             },
                   error: function(){
                         alert('Error updating question');
                        }
                });
            }else{
                alert('Only letter A,B,C,D are allowed in the answer field');
            }
        }else{
            alert("All filleds are Required")
        }


 }
