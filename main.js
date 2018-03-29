ImageList = new Mongo.Collection('ImageList');

if(Meteor.isClient){

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });

  Template.addImageForm.events({
    'click .addImage': function(){
      Modal.show('imageFormModal');
    }
  });

  Template.imageFormModal.events({
    'submit form': function(event){
      event.preventDefault();
      if($('#newImageRating').data('userrating') == undefined){
        alert("Please enter a rating.");
      } else{
        var userID = Meteor.userId();
        var email = Meteor.user().emails[0].address;
        var createdBy = Meteor.user().username;
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
        Modal.hide();
      }
    }
  });

  Template.editFormModal.events({
    'submit form': function(event){
      event.preventDefault();
      if($('#newImageRating').data('userrating') == undefined){
        alert("Please enter a rating.");
      } else{
        var imageData=Session.get("EditImageData");
        var imageID=imageData._id;
        var editImageName = event.target.editImageName.value;
        var editImagePath = event.target.editImagePath.value;
        var editImageDescription = event.target.editImageDescription.value;
        var editImageAltText = event.target.editImageAltText.value;
        var editImageRating = $('#newImageRating').data('userrating');
        ImageList.update(imageID,{$set:{imageName: editImageName, imagePath: editImagePath,
          imageDesc: editImageDescription, imageAlt: editImageAltText,
          rating: editImageRating }});
        alert("Image details edited!");
        event.target.editImageName.value = "";
        event.target.editImagePath.value = "";
        event.target.editImageDescription.value = "";
        event.target.editImageAltText.value = "";
        $('#newImageRating').trigger('reset');
        Modal.hide();
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
    },
    'correctUser': function(){
      return Meteor.userId()==this.userID;
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
    },
    'click .delete': function(){
      var confirmation= confirm("Do you want to delete image \""+this.imageName+"\"?");
      if (confirmation==true){
        ImageList.remove(this._id);
        alert("Image removed.");
      }
    },
    'click .edit': function(){
      Modal.show('editFormModal');
      Session.set("EditImageData", this);
      document.getElementById("editImageName").value=this.imageName;
      document.getElementById("editImagePath").value=this.imagePath;
      document.getElementById("editImageDescription").value=this.imageDesc;
      document.getElementById("editImageAltText").value=this.imageAlt;
    }
  });
}

if(Meteor.isServer){
  console.log("This line should be displayed in server.");
}
