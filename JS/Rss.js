
var xsltSheet;

// Éviter la console de journalisation de Google AJAXSLT.
logging__ = false;

$(function(){
	//empecher de perdre le service lors du drag de la page html
  	$('#Rss').draggable({ containment: 'parent' });
	//maximisée le service
        $('#RssFull').click(function () {
	   //montrer les resultats 
	  $('#Rssresults').show();    
	  $('#SelectRss').show();
	  $('#GoRss').show();
	   //cacher tous les autres services
	    $('#design_search').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:301,
	      
	      
	    });
	    $('#google').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:602,
	      
	      
	    });
	    $('#Maps').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:0,
	      
	      
	    });
	    $('#Youtube').animate({
	    
	    width: "25%",
	    height: "5%",
	    top:1043,
	    left:897,
	  
	  
	    });
	    //desactiver le drage en mode aggrandir
	    $('#Rss').draggable("disable");
	    //mettre les serives dans la bare
	    $('#Maps-menubarOuter').hide();
	    $('#Youtube-contents').hide();
	    $('#itineraire').hide();
	    $('#googleResult').hide();
	    $('#selectVille').hide();
	    $('#design_search_contents').hide();
	    $('#resultat').hide(); 
	    
	    //maintenant maximisée le service
	    $('#Rss').animate({ 
	        top:0,
		left:0,
		width: "100%",
		height: "94.5%",	
	      }, 15);
	     
	    //démaximisée le service
	    $('#RssBar').click(function () {
		  $('#design_search').show();
		  $('#google').show();
		  $('#Maps').show();
		  $('#Rss').draggable("enable");
		  $('#Rss').animate({ 
		      width: "40%",
		      height:"40%",
		    }, 500 );
	    });
      
	});
	
	// fermer le service
	$('#RssClose').click(function () {
	    $('#Rss').hide();
	});
	
	//appele des fonctions
	$("#GoRss").click(function(){
		 var FEED_URL=$("#SelectRss").val();
		    initPage(FEED_URL);
	});
} 
);

/* Fonction qui permet de mettre en place la la date, 
  de placer une image comme un titre et mettre le resultat dans la page html*/
function adjustData(html) {
  var RE_TITLE = '(<a .*?>)Client Web\\s*&gt;\\s*(.*?)(</a>)';
  var RE_TIMESTAMP = '(<span class="timestamp">)(.*?)(</span>)';
  var html = html.replace(RE_TIMESTAMP, function(match) {
        match[2] = new Date(match[2]).toLocaleString();
        return match[1] + match[2] + match[3];
    });
    html = html.replace(new RegExp(RE_TITLE, 'img'), '$1$2$3');
    
  
    return html;
} 

// la fonction qui envoie la demande au serveur
function getFeed(FEED_URL) {

    $.ajax({
	url:'/WebService/response?rest='+ encodeURIComponent(FEED_URL),
	type:'GET',
	dataType:'text',
	complete: function(requester) {
	    $('#Rssresults').show().text('Mise en forme&#8230;');
           
            var tmr = window.setTimeout(function() {
                window.clearTimeout(tmr);
                var data = xmlParse(requester.responseText);
                var html = xsltProcess(data, xsltSheet);
		
                $('#Rssresults').html(adjustData(html));
                //hideIndicator();
            }, 1);
	  }
	})	

}

// Démarrer le fichier XSL et lance le flux RSS

function initPage(FEED_URL) {

$.ajax({
	url:'xsl/breves.xsl',
	type: 'GET',
	dataType:"text",
	complete:function(requester){
	xsltSheet = xmlParse(requester.responseText);
	getFeed(FEED_URL);
	}


})
};
