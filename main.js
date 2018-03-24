ImageList = new Mongo.Collection('ImageList');

if(Meteor.isClient){
  Template.addImageForm.events({
    'submit form': function(event){
      event.preventDefault();
      if($('#newImageRating').data('userrating') == undefined){
        alert("Please enter a rating.");
      } else{
        var userID = Meteor.userId();
        var email = Meteor.user().emails[0].address;
        var createdBy = email.slice(0, email.indexOf("@"));
        var newImageName = event.target.newImageName.value;
        var newImagePath = event.target.newImagePath.value;
        var newImageDescription = event.target.newImageDescription.value;
        var newImageAltText = event.target.newImageAltText.value;
        var newImageRating = $('#newImageRating').data('userrating');
        ImageList.insert({imageName: newImageName, imagePath: newImagePath,
          imageDesc: newImageDescription, imageAlt: newImageAltText,
          rating: newImageRating, createdBy: createdBy, userID: userID,
          createdOn: new Date()});
        alert("New image is added!");
        event.target.newImageName.value = "";
        event.target.newImagePath.value = "";
        event.target.newImageDescription.value = "";
        event.target.newImageAltText.value = "";
        $('#newImageRating').trigger('reset');
      }
    }
  });

  Template.imageGallery.helpers({
    'images': function(){
      if(Session.get("SelectedUserID") != "" && Session.get("SelectedUserID") != undefined){
        return ImageList.find({userID: Session.get("SelectedUserID")}, {sort:{createdOn: -1}});
      } else{
        return ImageList.find({},{sort:{createdOn: -1}});
      }
    },
    'selectedUser': function(){
      if(Session.get("SelectedUserID") != "" && Session.get("SelectedUserID") != undefined){
        return Session.get("SelectedUserName");
      }
    }
    /*
    'userName': function(userID){
      var email = Meteor.users.findOne(userID).emails[0].address;
      return email;
    }
    */
  });

  Template.imageGallery.events({
    'click .user': function(){
      Session.set("SelectedUserID", this.userID);
      Session.set("SelectedUserName", this.createdBy);
    },
    'click .back': function(){
      Session.set("SelectedUserID", "");
      Session.set("SelectedUserName", "");
    }
  });
}

if(Meteor.isServer){
  console.log("This line should be displayed in server.");
}
