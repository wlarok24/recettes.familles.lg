/**********************************************************
** Programmed by William LaRocque as a side project in 2018
** Contact me at william.larocque@hotmail.com
** Not for commercial use
***********************************************************/
var recettes = recettes || {};
/* Authentification */
recettes.auth = recettes.auth || {};
recettes.auth.provider = new firebase.auth.GoogleAuthProvider();
recettes.auth.signIn = function(provider){
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  if (result.credential) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// ...
	  }
	  // The signed-in user info.
	  var user = result.user;
	  //$("#account").html(user.displayName);
	  swal("Bienvenue " + user.displayName, "Vous êtes connecté avec succès!", "success");
	}, function(error) {
		swal("Oups...", "Une erreur est survenue", "error");
	});
};
recettes.auth.signOut = function(){
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  swal("Au revoir", "Vous êtes déconnecté avec succès!", "success");
	}, function(error) {
	  // An error happened.
	  swal("Oups...", "Une erreur est survenue", "error");
	});
};
recettes.auth.contributors = [];
recettes.auth.isAContributor = function(user){
	with(recettes.auth){
		for(i = 0; i < contributors.length; i++){
			if(user.email == contributors[i]){
				return true;
			}
		}
		return false;
	}
};
recettes.auth.getContributors = function(){
	recettes.db.database.ref('contributors').once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				recettes.auth.contributors.push(childSnapshot.val());
			});
		});
};
/* Database */
recettes.db = recettes.db || {};
recettes.db.database = firebase.database();
recettes.db.recipeKeys = [];
recettes.db.recipes = [];
recettes.db.getRecettes = function(datatable){
	with(recettes.db){
		return database.ref('recettes').once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var cle = childSnapshot.key;
				recipeKeys.push(cle);
				var recette = childSnapshot.val();
				recipes.push(recette);
				datatable.row.add([
					"<a href='formulaire_recette.html?key=" + cle + "|' >" + recette.nom + "</a>",
					"<a href='" + recette.pdf + "' >La recette</a>",
					recette.difficulte,
					recette.duree,
					recette.type,
					recette.source,
					recette.ingredients,
					recette.tags,
					recette.description
				]).draw(false);
			});
		});
	}
};
recettes.db.getRecetteByKey = function(key, callback){
	with(recettes.db){
		return database.ref('recettes').once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					if(childSnapshot.key == key){
						// Il devrait avoir qu'une seule recette qui a la clé
						var recette = childSnapshot.val();
						callback(recette);
					}
			});
		});
	}
};
recettes.db.ajouterRecette = function(nom, description, source, difficulte, duree, type, ingredients, tags, pdf){
	//ajouter une nouvelle recette
	var nouvelleRecette = recettes.db.database.ref('recettes').push();
	return nouvelleRecette.set({
		nom: nom,
		description : description,
		source : source,
		difficulte : difficulte,
		duree : duree,
		type : type,
		ingredients : ingredients,
		tags : tags,
		pdf : pdf
	}); //Retourne une promesse
};
recettes.db.modifierRecette = function(key, nom, description, source, difficulte, duree, type, ingredients, tags, pdf){
	//modifier la recette identifiable par key
	return recettes.db.database.ref('recettes/' + key).set({
		nom: nom,
		description : description,
		source : source,
		difficulte : difficulte,
		duree : duree,
		type : type,
		ingredients : ingredients,
		tags : tags,
		pdf : pdf
	}); //Retourne une promesse
};
recettes.db.supprimerRecette = function(key){
	return recettes.db.database.ref('recettes/' + key).remove(); //Retourne une promesse
};

/* Document ready for nav */
$(document).ready(function() {
	with(recettes.auth){
		getContributors();
		$("#btnSignIn").show();
		$("#btnContributorRequest").hide();
		$("#btnSignOut").hide();
		$("#btnSignIn").click(function(){
			signIn(provider);
		});
		$("#btnContributorRequest").click(function(){
			swal("Comment devenir un contributeur",
				"<ul><li>" +
				"Envoyer un courriel à l'addresse <a href='mailto:recettes.familles.lg@gmail.com'>recettes.familles.lg@gmail.com</a> avec votre addresse courriel de votre compte Google</li><li>" +
				"Dans le courriel, veuiller indiquer ce que vous allez contribuer à notre librairie de recettes.</li></ul><br>" +
				"Merci beaucoup", 
				"info");
		});
		$("#btnSignOut").click(signOut);
		$(".auth").hide();
		//S'il y a un changement dans sign in ou out
		firebase.auth().onAuthStateChanged(function(user){
			if(user != null){ //Signed in
				$("#account").html(user.displayName);
				$("#btnSignIn").hide();
				$("#btnSignOut").show();
				$("#btnContributorRequest").show();
				if(isAContributor(user)){
					$(".auth").show(); // User is a contributor
				} else {
					$(".auth").hide();
				}
			} else { //Signed out
				$("#account").html("Mon compte");
				$("#btnSignIn").show();
				$("#btnSignOut").hide();
				$("#btnContributorRequest").hide();
				$(".auth").hide();
			}
		});
	}
});
	