Messages = new Meteor.Collection("Messages");

if (Meteor.isClient) {
  Template.messages.messages = function() {
    return Messages.find({

    }, {
      sort: {
        timestamp: -1
      },
      limit: 20
    });
  };

  Template.input.events({
    'click #send': function() {
      var message = $('#newMessage').val();
      var username = $('#username').val();
      if (!message || !username) {
        alert('Fill out both fields yo!');
      }
      Meteor.saveMessage({
        message: message,
        username: username
      });
    }
  });

  Meteor.autorun(function() {
    Meteor.subscribe("Messages");
  });

  Meteor.saveMessage = function(content) {
    var username = content.username;
    var message = content.message;
    if (!username || !message) {
      return;
    }
    Messages.insert({
      username: username,
      message: message,
      timestamp: Date.now()
    }, function(err, id) {
      if (err) {
        alert('Something defnitely went wrong!');
      }
      if (id) {
        $('#newMessage').val('');
        $('#username').val('');
      }
    });
  };

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup

  });

  Meteor.publish("Messages", function() {
    return Messages.find();
  });

  Messages.allow({
    'insert': function(userId, doc) {
      return true;
    },
    'remove': function(userId, doc) {
      return false;
    }
  });
}