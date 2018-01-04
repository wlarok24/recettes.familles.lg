/**********************************************************
** Programmed by William LaRocque as a side project in 2018
** Contact me at william.larocque@hotmail.com
** Not for commercial use
***********************************************************/
/** JavaScript file for recettes.html
	Need to be imported after recettes_familles_lg.js **/
$(document).ready(function(){
	var datatable = $('#recettes').DataTable({
		responsive : true,
		"scrollY":        "500px",
        "scrollCollapse": true,
        "paging":         false,
		"columnDefs": [ {
			"targets": 1,
			"orderable": false,
			"searchable": false,
			"visible": true
		}],
		language: {
			processing:     "Traitement en cours...",
			search:         "Recherche&nbsp;:",
			lengthMenu:     "Afficher _MENU_ &eacute;l&eacute;ments",
			info:           "Affichage des &eacute;lements _START_ &agrave; _END_ sur _TOTAL_",
			infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
			infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
			infoPostFix:    "",
			loadingRecords: "Chargement en cours...",
			zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
			emptyTable:     "Aucune donnée disponible",
			paginate: {
				first:      "Premier",
				previous:   "Pr&eacute;c&eacute;dent",
				next:       "Suivant",
				last:       "Dernier"
			},
			aria: {
				sortAscending:  ": activer pour trier la colonne par ordre croissant",
				sortDescending: ": activer pour trier la colonne par ordre décroissant"
			}
		}
	});
	if((datatable != null)||(datatable !== undefined)){
		recettes.db.getRecettes(datatable);
	}
});