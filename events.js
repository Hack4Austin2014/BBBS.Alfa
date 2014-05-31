function GetEvents(ids)
{
  var arrayTest = new Array();
  var fb = new Firebase("https://amber-fire-6558.firebaseio.com/data/events");

  fb.once('value', function(snapshot) {
    snapshot.forEach(function(userSnap) {
      var i = 0;
      // jQuery("#eventsDiv").append("Event: " + userSnap.val().title + "<br/>");
      if (ids == undefined)
      {
          jQuery("#eventsDiv").append("Event: " + userSnap.val().title + "<br/>");
      }
      else
      {
        ids.forEach(function(idName)
        {
          if (userSnap.name() == idName || ids == undefined)
          {
            arrayTest.push(userSnap);
            // console.log(userSnap.val());
            jQuery("#eventsDiv").append("Event: " + userSnap.val().title + "<br/>");
            ids.splice(i, 1);
          }
        });
      }
    });

    setIds(arrayTest);

    console.log(arrayTest);

    // console.log(arrayTest[0]);
    // console.log(arrayTest.length);
  });

}

function GetAllIds()
{
  var fb = new Firebase("https://amber-fire-6558.firebaseio.com/data/events");

  fb.once('value', function(snapshot) {
    var idArray = new Array();
    snapshot.forEach(function(userSnap) {
      console.log(userSnap.name());
      idArray.push(userSnap.name());
    });
    setIds(idArray);
    GetEvents();
  });
}

// Load everything initially
GetAllIds();

var Ids = function()
{
  return this.ids;
};

function getIds()
{
  return Ids.ids;
}

function setIds(newIds)
{
  Ids.ids = newIds;
};

// Filter by Name

function nameFilter(value)
{
//  jQuery("#eventsDiv").

}

setIds(new Array("-JOII_RViT5dV1rmwvuY", "-JOIJTxJyZKBGNFk1JD5"));

console.log("-----");

