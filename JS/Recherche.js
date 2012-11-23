
 $(function() {
    //empecher de perdre le service lors du drag de la page html
    $('#design_search').draggable({ containment: 'parent' });
   
    //maximisée le service
    $('#design_searchMapFull').click(function () {
       //montrer les resultats 
      $('#design_search_contents').show();
      $('#resultat').show();
      	  //cacher tous les autres services
	$('#Rss').animate({
	    
	    width: "25%",
	    height: "5%",
	    top:1043,
	    left:0,
	  
	  
	});
	    
	$('#google').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:301,
	      
	      
	    });
	$('#Maps').animate({
	    width: "25%",
	    height: "5%",
	    top:1043,
	    left:602,
  
	  
	});
	
	$('#Youtube').animate({
	    
	    width: "25%",
	    height: "5%",
	    top:1043,
	    left:897,
	  
	  
	});
	    
	    
	 //desactiver le drage en mode aggrandir
      $('#design_search').draggable("disable");
      //cacher tous les autres services
      $('#design_search').animate({ 
	  top:0,
	  left:0,
	  width: "100%",
	  height: "94.5%",	

	}, 15 );

	//mettre les serives dans la bare
	$('#selectVille').hide();
	$('#itineraire').hide();
	$('#SelectRss').hide();
	$('#GoRss').hide();
	$('#Youtube-contents').hide();
	$('#google_contents').hide();
	$('#Rssresults').hide();
	
	/*$('#resultat').animate({ 
	  width: "90%",
	});*/
    //démaximisée le service
    $('#design_searchMapBar').click(function () {
	$('#design_search').draggable("enable");
	$('#design_search').animate({ 
	    width: "40%",
	    height:"40%",
	  }, 500 );
    });


    });
    
    //démaximisée le service
    $('#design_searchMapClose').click(function () {
	$('#design_search').hide();
    });
    
 
    $("#b_search").click(function(){
	    connecte();
	    return false;
    });
  });

// la fonction qui envoie la demande au serveur
function connecte(){
      var key="ABQIAAAAPf2nnbMU8jBNDCEpFQxsZhQ_eswkAUXL4ShrAGgQFRerlScB6BSnULQGDS2rvhaLNHUh6Cb-YbLudA";
      var v="1.0";
      var userName="192.168.1.1";
      var adre="https://ajax.googleapis.com/ajax/services/search/web?";

		
 
	var q=$("#mon-champ").val();
	var dataTrans=adre+"v="+v+"&q="+q+"&key="+key+"&userip="+userName;
	
	$.ajax({
	url:"/WebService/response",
	data:{
	      'rest':dataTrans,
	},
	dataType:'json',
	success: function(requester) {
	   analyse(requester);

	}
	
      })

}


// Metre le resultat sur la page html
function analyse(q){
  
 var data=q;
 var nbResulta= data.responseData.cursor.resultCount;
 var ResultData = data.responseData.results;

 
  if(nbResulta){
	var ResultRecherch= '<br>'+nbResulta+'Resultats<br/><dl>';
	ResultData.forEach(function(element,index,array){
	
	ResultRecherch+="<dt><a href='"+element.url+"'><b>"+element.title+"'</b></a></dt>";
	ResultRecherch+="<dd>"+element.content+"</dd>";
	ResultRecherch+="<dd><u>"+element.url+"</u></dd>";
	});
	
	ResultRecherch+="</dl>";
	
	$('#resultat').html(ResultRecherch);
	}

}
