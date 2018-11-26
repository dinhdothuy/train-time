

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDKU37__U1IZbliBWYS84Rsx7dNRuLPl48",
    authDomain: "train-schedule-3b81d.firebaseapp.com",
    databaseURL: "https://train-schedule-3b81d.firebaseio.com",
    storageBucket: "",
  };

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  // Creates local "temporary" object for holding trains data
  var addTrain = {
    name: trainName,
    destination: destination,
    firstTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads trains data to the database
  database.ref().push(addTrain);

  // Logs everything to console
  console.log(addTrain.name);
  console.log(addTrain.destination);
  console.log(addTrain.firstTime);
  console.log(addTrain.frequency);

  alert("New train schedule successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train data to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var addTrainName = childSnapshot.val().name;
  var addDestination = childSnapshot.val().destination;
  var addFirstTime = childSnapshot.val().firstTime;
  var addFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(addTrainName);
  console.log(addDestination);
  console.log(addFirstTime);
  console.log(addFrequency);

  /*Create variables for time storage*/

  // get hour and minute
  var getTime = addFirstTime.split(":"); // split string of first train time input into an array has hour and minute
  var firstTrain = moment().hours(getTime[0]).minutes(getTime[1]);
  var minutesAway;
  var timeArrival;

  // Calculate time:
  var differenceTimes = moment().diff(firstTrain, "minutes"); // different minutes from current time to input time
  var timeRemainder = differenceTimes % addFrequency; // then we can count the minutes left
  minutesAway = addFrequency - timeRemainder;
  timeArrival = moment().add(minutesAway, "m").format("hh:mm A"); // and will know when the train will come

  console.log("minutesAway:", minutesAway);
  console.log("timeArrival:", timeArrival);


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(addTrainName),
    $("<td>").text(addDestination),
    $("<td>").text(addFrequency),
    $("<td>").text(timeArrival),
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

});

