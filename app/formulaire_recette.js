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
					// Get value of fields
					var cip = $("<div />");
					var name = cip.text($("#recipeName").val()).html();
					var desc = cip.text($("#recipeDesc").val()).html();
					var sourceRecipe = cip.text($("#recipeSource").val()).html();
					var diff = cip.text($("#recipeDiff option:selected").html()).html();
					var duration = cip.text($("#recipeDuration option:selected").html()).html();
					var type = cip.text($("#recipeType option:selected").html()).html();
					var ingredients = cip.text($("#recipeIngredients").val()).html();
					var tags = cip.text($("#recipeTags").val()).html();
					var pdfLink = cip.text($("#recipePDF").val()).html();
					//Ajouter le tag pour savoir si la recette a été testée
					if (tags === ""){
						tags = cip.text($("#recipeTested").val()).html();
					} else if (tags.includes("Non-testée") && cip.text($("#recipeTested").val()).html() === "Testée") {
						tags.replace("Non-testée", "Testée");
					} else if (tags.includes("Testée") && cip.text($("#recipeTested").val()).html() === "Non-testée") {
						tags.replace("Testée", "Non-testée");
					} else {
						tags = tags.concat(", ", cip.text($("#recipeTested").val()).html());
					}
					//Verifier le lien drive pour les pdfs
					if((pdfLink.includes("https://drive.google.com/file/d/"))&&((pdfLink.includes("/view?usp=sharing"))||(pdfLink.includes("/view?usp=drivesdk")))){
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
						swal("Erreur", "Le lien vers le fichier pdf doit venir de Google drive et partager le fichier.", "error")
					}
				}
			});
			$("#delete_recipe").show();
			$("#delete_recipe").click(function(){
				if(!$(this).hasClass("disabled")){
					// Delete recipe
					var promise = recettes.db.supprimerRecette(key);
					promise.then(function(val){
						swal("Succès", "La recette a été supprimer avec succès!", "success");
					}).catch(
						(reason) => {
							swal("Erreur", reason, "error");
					});
				}
			});
		} else {
			$("#add_recipe").show();
			$("#add_recipe").click(function(){
				if(!$(this).hasClass("disabled")){
					// Get value of fields
					var cip = $("<div />");
					var name = cip.text($("#recipeName").val()).html();
					var desc = cip.text($("#recipeDesc").val()).html();
					var sourceRecipe = cip.text($("#recipeSource").val()).html();
					var diff = cip.text($("#recipeDiff option:selected").html()).html();
					var duration = cip.text($("#recipeDuration option:selected").html()).html();
					var type = cip.text($("#recipeType option:selected").html()).html();
					var ingredients = cip.text($("#recipeIngredients").val()).html();
					var tags = cip.text($("#recipeTags").val()).html();
					var pdfLink = cip.text($("#recipePDF").val()).html();
					//Ajouter le tag pour savoir si la recette a été testée
					if (tags === ""){
						tags = cip.text($("#recipeTested").val()).html();
					} else {
						tags = tags.concat(", ", cip.text($("#recipeTested").val()).html());
					}
					//Verifier le lien drive pour les pdfs
					if((pdfLink.includes("https://drive.google.com/file/d/"))&&((pdfLink.includes("/view?usp=sharing"))||(pdfLink.includes("/view?usp=drivesdk")))){
						// Add recipe
						var promise = recettes.db.ajouterRecette(name, desc, sourceRecipe, diff, duration,
							type, ingredients, tags, pdfLink);
						promise.then(function(val){
							swal("Succès", "La recette a été ajoutée avec succès!", "success");
						}).catch(
							(reason) => {
								swal("Erreur", reason, "error");
						});
					} else {
						swal("Erreur", "Le lien vers le fichier pdf doit venir de Google drive et partager le fichier.", "error")
					}
				}
			});
			$("#update_recipe").hide();
			$("#delete_recipe").hide();
		}
	}
});