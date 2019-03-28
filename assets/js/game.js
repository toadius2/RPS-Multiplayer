	var config = {
		apiKey: "AIzaSyCvDSFNXLKbgJzxOwJHkJDPFwMpgIuLrNE",
		authDomain: "adam-rps-homework7.firebaseapp.com",
		databaseURL: "https://adam-rps-homework7.firebaseio.com",
		projectId: "adam-rps-homework7",
		storageBucket: "adam-rps-homework7.appspot.com",
		messagingSenderId: "255608791865"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	var p1Wins;
	var p1Losses;
	var p1Name;
	var p1Choice;

	var p2Wins;
	var p2Losses;
	var p2Name;
	var p2Choice;

	var playerTurn;
	var whoAmI = "none";

	var theme = 1;

	
    database.ref().on("value", function(snapshot) {
    	if(snapshot.val().db_playerTurn !== undefined) {
    		playerTurn = snapshot.val().db_playerTurn;
    	}
 
    	else {
    		database.ref().update({
    			db_playerTurn: 1
    		});
    	}
		if(snapshot.val().db_p1Name !== undefined) {
			$("#player1Name").text(snapshot.val().db_p1Name);
			$("#player1LblWins").text("Wins: " + snapshot.val().db_p1Wins);
			$("#player1LblLosses").text("Losses: " + snapshot.val().db_p1Losses);
		}
	
		else if(snapshot.val().db_p1Name === undefined && snapshot.val().db_p2Name !== undefined) {
			$("#p2c1").text(" ");
			$("#p2c2").text(" ");
			$("#p2c3").text(" ");
			$("#gameStats").text("Waiting for a new opponent...");
			$("#player1Name").text("Empty Seat");
			$("#player1LblWins").text(" ");
			$("#player1LblLosses").text(" ");
		}
		else {
			$("#player1Name").text("Empty Seat");
			$("#player1LblWins").text(" ");
			$("#player1LblLosses").text(" ");
		}

		if(snapshot.val().db_p2Name !== undefined) {
			$("#player2Name").text(snapshot.val().db_p2Name);
			$("#player2LblWins").text("Wins: " + snapshot.val().db_p2Wins);
			$("#player2LblLosses").text("Losses: " + snapshot.val().db_p2Losses);
		}

		else if(snapshot.val().db_p2Name === undefined && snapshot.val().db_p1Name !== undefined) {
			$("#p1c1").text(" ");
			$("#p1c2").text(" ");
			$("#p1c3").text(" ");
			$("#gameStats").text("Waiting for a new opponent...");
			$("#player2Name").text("Empty Seat");
			$("#player2LblWins").text(" ");
			$("#player2LblLosses").text(" ");
		}
		else {
			$("#player2Name").text("Empty Seat");
			$("#player2LblWins").text(" ");
			$("#player2LblLosses").text(" ");
		}

		if(snapshot.val().db_p1Name !== undefined && snapshot.val().db_p2Name !== undefined) {
			
			if(snapshot.val().db_playerTurn === 1) {
				if(whoAmI === "player1") {

					$(".player1Rock").text("Rock");
					$(".player1Paper").text("Paper");
					$(".player1Scissors").text("Scissors");
					$("#gameStats").text("Choose your weapon!");
					$("#p2c1").text(" ");
				}
				else {
					$("#gameStats").text("Waiting for Player 1 to choose");
					$("#p1c1").text(" ");
					$("#p2c1").text(" ");
				}
			}
			
			else if(snapshot.val().db_playerTurn === 2) {
				if(whoAmI=== "player2") {
				
					$(".player2Rock").text("Rock");
					$(".player2Paper").text("Paper");
					$(".player2Scissors").text("Scissors");
					$("#gameStats").text("Choose your weapon!");
					$("#p1c1").text(" ");
				}
				else {
					$("#gameStats").text("Waiting for Player 2 to choose");
					$("#p1c1").text(" ");
					$("#p2c1").text(" ");
				}
			}
		
			else if(snapshot.val().db_playerTurn === 0) {
				
				p1Choice = snapshot.val().db_p1Choice;
				p2Choice = snapshot.val().db_p2Choice;
				$("#p1c1").text(p1Choice);
				$("#p2c1").text(p2Choice);

				if(theme === 1) {
					var imgStyle = "3d";
					theme++;
				}
				else if(theme === 2) {
					var imgStyle = "icon";
					theme++;
				}
				else if(theme === 3) {
					var imgStyle = "real";
					theme++;
				}
				else {
					var imgStyle = "bathroom";
					theme = 1;
				}

				$("#p1Image").html('<img src="assets/images/' + imgStyle + p1Choice + '.png" alt="' + p1Choice + '" class="img img-responsive" />');
				$("#p2Image").html('<img src="assets/images/' + imgStyle + p2Choice + '.png" alt="' + p2Choice + '" class="img img-responsive" />');

				
				if((p1Choice === "Rock" && p2Choice === "Scissors") || (p1Choice === "Paper" && p2Choice === "Rock") || (p1Choice === "Scissors" && p2Choice === "Paper")) {
					$("#gameStats").text("Player 1 wins!");
					
					if(whoAmI === "player1") {
						p1Wins = snapshot.val().db_p1Wins;
						p1Wins++;
						p2Losses = snapshot.val().db_p2Losses;
						p2Losses++;
						playerTurn = 3;
						database.ref().update({
							db_p1Wins: p1Wins,
							db_p2Losses: p2Losses,
							db_playerTurn: playerTurn
						});
					}
				}
			//if (Date.now) - chatMessage.timestamp < 1000000){}
				else if((p2Choice === "Rock" && p1Choice === "Scissors") || (p2Choice === "Paper" && p1Choice === "Rock") || (p2Choice === "Scissors" && p1Choice === "Paper")) {
					$("#gameStats").text("Player 2 wins!");
				
					if(whoAmI === "player1") {
						p2Wins = snapshot.val().db_p2Wins;
						p2Wins++;
						p1Losses = snapshot.val().db_p1Losses;
						p1Losses++;
						playerTurn = 3;
						database.ref().update({
							db_p2Wins: p2Wins,
							db_p1Losses: p1Losses,
							db_playerTurn: playerTurn
						});
					}
				}
				
				else {
					$("#gameStats").text("It's a draw!")
				}
		
				setTimeout(resetPlayerTurn, 1000 * 5);
			}
		}

	    // if a new user arrives & no p1, user can become p1
		if(whoAmI === "none" && snapshot.val().db_p1Name === undefined) {
			drawPlayerNameInput("player1");
			resetPlayerTurn();
		}

		else if(whoAmI === "none" && snapshot.val().db_p2Name === undefined) {
			drawPlayerNameInput("player2");
			resetPlayerTurn();
		}
		
		else if(whoAmI === "none") {
			drawPlayerNameDisplay();
		}

    	
    	p1Choice = snapshot.val().db_p1Choice;

    
    }, function(errorObject) {
    	console.log("The read failed: " + errorObject.code);
    });

	$(document).on("click", ".choice", function() {
		var decision = $(this).attr("data-val");
		
		if(playerTurn === 1) {
			playerTurn = 2;
			
			database.ref().update({
				db_p1Choice: decision,
				db_playerTurn: playerTurn
			});
			$(".player1Rock").text(" ");
			$(".player1Paper").text (" ");
			$(".player1Scissors").text (" ");
		}
		
		else if(playerTurn === 2) {
			
			playerTurn = 0;
			
			database.ref().update({
				db_p2Choice: decision,
				db_playerTurn: playerTurn
			});
			
			$(".player2Paper").text (" ");
			$(".player2Scissors").text (" ");
		}
	});

	$(document).on("click", ".btnPlayerNameInput", function(event) {
		event.preventDefault();

		playerTurn = 1;

		if($(this).attr("id") === "player1") {
			p1Name = $("#playerNameInput").val().trim();
			database.ref().update({
				db_p1Name: p1Name,
				db_p1Wins: 0,
				db_p1Losses: 0,
				db_playerTurn: playerTurn
			});
			
			whoAmI = "player1";
			drawPlayerNameDisplay();
		}

		else if($(this).attr("id") === "player2") {
			p2Name = $("#playerNameInput").val().trim();
			database.ref().update({
				db_p2Name: p2Name,
				db_p2Wins: 0,
				db_p2Losses: 0,
				db_playerTurn: playerTurn
			});

			whoAmI = "player2";
			drawPlayerNameDisplay();
		}
	});


	function resetPlayerTurn() {
		database.ref().update({
			db_playerTurn: 1
		});
		$("#p1Image").html(" ");
		$("#p2Image").html(" ");
	}

	function drawPlayerNameInput(whichPlayer) {
    	$("#playerIntro").html(
			'<form id="submitMessage" class="form-inline">'
		+		'<div class="form-group">'
		+			'<input type="text" class="form-control" id="playerNameInput" placeholder="Your Name">'
		+		'</div>'
		+	'</form>'
		);
		var btn = $('<button type="submit" class="btn btn-default btnPlayerNameInput" id="' + whichPlayer + '">Start</button>');
		$("#submitMessage").append(btn);
	}

	// Shows the player which seat they're in, or if they're spectating
	function drawPlayerNameDisplay() {
		if(whoAmI === "none") {
			$("#playerIntro").html("You are currently spectating.");
		}
		else if(whoAmI === "player1") {
			$("#playerIntro").html("Hi, " + p1Name + "! You are player 1.");
			$("#p1c1").addClass("player1Rock");
			$("#p1c2").addClass("player1Paper");
			$("#p1c3").addClass("player1Scissors");
		}
		else if(whoAmI === "player2") {
			$("#playerIntro").html("Hi, " + p2Name + "! You are player 2.");
			$("#p2c1").addClass("player2Rock");
			$("#p2c2").addClass("player2Paper");
			$("#p2c3").addClass("player2Scissors");
		}
	}

	$(document).on("click", "#chatSubmit", function(event) {
		event.preventDefault();

		var chatText = $("#inputChatText").val().trim();
		var myName = "Spectator";

		if(whoAmI === "player1") {
			myName = p1Name;
		}
		else if(whoAmI === "player2") {
			myName = p2Name;
		}

		database.ref('chat').push({
			db_chatName: myName,
			db_chatType: whoAmI,
			db_chatText: chatText
		});
		$("#inputChatText").val(" ");
		submitMessage();
	});

function submitMessage(){
	console.log("hit submit message");
	database.ref('chat').on("child_added", function(snapshot) {
		var chatType = snapshot.val().db_chatType;
		var chatName = snapshot.val().db_chatName;
		var chatText = snapshot.val().db_chatText;


		if(chatType === "player1") {
			$("#chatTextArea").prepend(chatName + ": " + chatText + '\r\n');
		}
		else if(chatType === "player2") {
			$("#chatTextArea").prepend(chatName + ": " + chatText + '\r\n');
		}
		else if(chatType === "none") {
			$("#chatTextArea").prepend(chatName + ": " + chatText + '\r\n');
		}
	});
}

	$(window).unload(function(){
		if(whoAmI === "player1") {
			database.ref().update({
				db_p1Name: null,
				db_p1Wins: 0,
				db_p1Losses: 0
			});


		}
		else if(whoAmI === "player2") {
			database.ref().update({
				db_p2Name: null,
				db_p2Wins: 0,
				db_p2Losses: 0
			});
		}
		database.ref('chat').remove();
	});