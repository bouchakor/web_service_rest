URN_c = 'http://www.google.com/calendar/feeds/french@holiday.calendar.google.com/public/full?alt=json';

$(function(){
	//empecher de perdre le service lors du drag de la page html
	$('#google').draggable({ containment: 'parent' });
	 //maximisée le service
        $('#googleFull').click(function () {
	    //montrer les resultats 
	    $('#google_contents').show();
	    $('#googleResult').show();
	    //cacher tous les autres services
	    $('#design_search').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:897,
	      
	      
	    });
	    $('#Rss').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:602,
	      
	      
	    });
	    $('#Maps').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:301,
	      
	      
	    });
	    $('#Youtube').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:0,
	      
	      
	    });
	     //desactiver le drage en mode aggrandir
	    $('#google').draggable("disable");
	    //mettre les serives dans la bare
	    $('#Maps-menubarOuter').hide();
	    $('#Youtube-contents').hide();
	    $('#itineraire').hide();
	    $('#SelectRss').hide();
	    $('#GoRss').hide();
	    $('#selectVille').hide();
	    $('#design_search_contents').hide();
	    $('#Rssresults').hide();
	    $('#resultat').hide(); 
	    
	    //maintenant maximisée le service
	    $('#google').animate({ 
	        top:0,
		left:0,
		width: "100%",
		height: "94.5%",	
	      }, 15);
	    
	     //démaximisée le service
	    $('#googleBar').click(function () {
		  $('#design_search').show();
		  $('#Rss').show();
		  $('#Maps').show();
		  $('#google').draggable("enable");
		  $('#google').animate({ 
		      width: "40%",
		      height:"40%",
		    }, 10 );
	    });
      
	});
	
	// fermer le service
	$('#googleClose').click(function () {
	    $('#google').hide();
	});
	
    	//appele des fonctions
	requestGoogleJson();

	
});

// la fonction qui envoie la demande au serveur
function requestGoogleJson(){

      $.ajax({
	url:"/WebService/response",
	data:{
	      'rest':URN_c,
	},
	dataType:'json',
	success: function(requester) {
	   toDoOnSuccessGoogle(requester);

	}
	
      })
}

// la fonction qui intialise les jours féries et affiché le résultat sur la page
function toDoOnSuccessGoogle(requester) {

    var feed = requester.feed;
    var entries = feed.entry || [];
    var holiday=new Array();
    for (var i = 0; i < entries.length; ++i) {
	var entry = entries[i];
   	holiday.push({
	    date:entry.gd$when[0].startTime,
	    title:entry.title.$t
	});
    
    }
    $("#google_contents").datepicker({
	beforeShowDay:function(date){
	    return setJourFeries(date,holiday);
	}
    });
}

// fonction permets de comparé les jours feriés avec le calendrier
function setJourFeries(date,holiday){
    var annee=date.getFullYear();
    var mois;

    if((date.getMonth()+1)<10)
	mois='0'+(date.getMonth()+1);
    else
	mois=(date.getMonth()+1);

    var jour;
    if(date.getDate()<10)
	jour='0'+date.getDate();
    else
	jour=date.getDate();

    var dateComp=annee+"-"+mois+"-"+jour;
    var result='</br>';
    for(var i=0;i<holiday.length;i++)
	if(dateComp==holiday[i].date){
		
	    return [true,'holiday',holiday[i].title];
	}
    return [true,'',''];
}

