/**********************************************************
** Programmed by William LaRocque as a side project in 2018
** Contact me at william.larocque@hotmail.com
** Not for commercial use
***********************************************************/
/** JavaScript file for formulaire_recette.js
	Need to be imported after recettes_familles_lg.js **/
/* HTML parameters */
var recettes = recettes || {};
recettes.param = recettes.param || {};
recettes.param.key = null;
recettes.param.recette = null;
recettes.param.getRecetteKeyFromHTML = function(){
	var url = window.location.href;
	// La clé sera mise après 'key=' et le charactère '|' sera après
	var keySplit = url.split("key=");
	if ((keySplit[1] != null)||(keySplit[1] !== undefined)) {
		var keyValAndOtherParams = keySplit[1];
		if ((keyValAndOtherParams != null)||(keyValAndOtherParams !== undefined)){
			return keyValAndOtherParams.split("|")[0];
		} else {
			return null;
		}
	} else {
		return null;
	}
};
$(document).ready(function() {
	with(recettes.param){
		key = getRecetteKeyFromHTML();
		if(key != null){
			recettes.db.getRecetteByKey(key, function(val){
				recette = val;
				$("#recipeName").val(recette.nom);
				$("#recipeDesc").val(recette.description);
				$("#recipeSource").val(recette.source);
				$("#recipeDiff").val(recette.difficulte);
				$("#recipeDuration").val(recette.duree);
				$("#recipeType").val(recette.type);
				$("#recipeIngredients").val(recette.ingredients);
				$("#recipeTags").val(recette.tags);
				$("#recipePDF").val(recette.pdf);
			});
			$("#add_recipe").hide();
			$("#update_recipe").show();
			$("#update_recipe").click(function(){
				if(!$(this).hasClass("disabled")){
					if(recettes.auth.isAContributor(firebase.auth().currentUser)){
						// Get value of fields
						var name = $("#recipeName").val();
						var desc = $("#recipeDesc").val();
						var sourceRecipe = $("#recipeSource").val();
						var diff = $("#recipeDiff option:selected").html();
						var duration = $("#recipeDuration option:selected").html();
						var type = $("#recipeType option:selected").html();
						var ingredients = $("#recipeIngredients").val();
						var tags = $("#recipeTags").val();
						var pdfLink = $("#recipePDF").val();
						// Update recipe
						var promise = recettes.db.modifierRecette(key, name, desc, sourceRecipe, diff, duration,
							type, ingredients, tags, pdfLink);
						promise.then(function(val){
							swal("Succès", "La recette a été modifiée avec succès!", "success");
						}).catch(
							(reason) => {
								swal("Erreur", reason, "error");
						});
					} else {
						swal("Vous n'êtes pas un contributeur", 
							"Pour devenir un contributeur : <br><ul><li>" +
							"Envoyer un courriel à l'addresse <a href='mailto:recettes.familles.lg@gmail.com'>recettes.familles.lg@gmail.com</a> avec votre addresse courriel de votre compte Google</li><li>" +
							"Dans le courriel, veuiller indiquer ce que vous allez contribuer à notre librairie de recettes.</li></ul><br>" +
							"Merci beaucoup","warning");
					}
				}
			});
			$("#delete_recipe").show();
			$("#delete_recipe").click(function(){
				if(!$(this).hasClass("disabled")){
						if(recettes.auth.isAContributor(firebase.auth().currentUser)){
						// Delete recipe
						var promise = recettes.db.supprimerRecette(key);
						promise.then(function(val){
							swal("Succès", "La recette a été supprimer avec succès!", "success");
						}).catch(
							(reason) => {
								swal("Erreur", reason, "error");
						});
					} else {
						swal("Vous n'êtes pas un contributeur", 
							"Pour devenir un contributeur : <br><ul><li>" +
							"Envoyer un courriel à l'addresse <a href='mailto:recettes.familles.lg@gmail.com'>recettes.familles.lg@gmail.com</a> avec votre addresse courriel de votre compte Google</li><li>" +
							"Dans le courriel, veuiller indiquer ce que vous allez contribuer à notre librairie de recettes.</li></ul><br>" +
							"Merci beaucoup","warning");
					}
				}
			});
		} else {
			$("#add_recipe").show();
			$("#add_recipe").click(function(){
				if(!$(this).hasClass("disabled")){
					if(recettes.auth.isAContributor(firebase.auth().currentUser)){
						// Get value of fields
						var name = $("#recipeName").val();
						var desc = $("#recipeDesc").val();
						var sourceRecipe = $("#recipeSource").val();
						var diff = $("#recipeDiff option:selected").html();
						var duration = $("#recipeDuration option:selected").html();
						var type = $("#recipeType option:selected").html();
						var ingredients = $("#recipeIngredients").val();
						var tags = $("#recipeTags").val();
						var pdfLink = $("#recipePDF").val();
						// Add recipe
						var promise = recettes.db.ajouterRecette(name, desc, sourceRecipe, diff, duration,
							type, ingredients, tags, pdfLink);
						promise.then(function(val){
							swal("Succès", "La recette a été modifiée avec succès!", "success");
						}).catch(
							(reason) => {
								swal("Erreur", reason, "error");
						});
					}
				} else {
					swal("Vous n'êtes pas un contributeur", 
					"Pour devenir un contributeur : <br><ul><li>" +
					"Envoyer un courriel à l'addresse <a href='mailto:recettes.familles.lg@gmail.com'>recettes.familles.lg@gmail.com</a> avec votre addresse courriel de votre compte Google</li><li>" +
					"Dans le courriel, veuiller indiquer ce que vous allez contribuer à notre librairie de recettes.</li></ul><br>" +
					"Merci beaucoup","warning");
				}
			});
			$("#update_recipe").hide();
			$("#delete_recipe").hide();
		}
	}
});