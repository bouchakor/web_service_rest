
$(function(){
   
  
    //empecher de perdre le service lors du drag de la page html
    $('#Youtube').draggable({ containment: 'parent' });
   


    //démaximisée le service
    $('#Youtube-Bar').click(function () {
	
	
	$('#Youtube').animate({
	    top:0,
	    left:0,
	    width: "40%",
	    height:"40%",
	  }, 500 );
	$('#Youtube-menubar').show();
	$('#Youtube-contents').show();
    });


    
    
    //Fermer le service
    $('#Youtube-Close').click(function () {
	$('#Youtube').hide();
    });
    $("#Goo").click(function(){
    conectYoutube();
    return false;
    });
});

// la fonction qui envoie la demande au serveur
function conectYoutube(){
    var search_input=$("#search_input").val();
    var keyword= encodeURIComponent(search_input);
    var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=1&v=2&alt=jsonc'; 

    $.ajax({
	url:"/WebService/response",
	data:{
		      'rest':yt_url,
	},
	dataType:'json',
	success: function(response){
		TraitYoutube(response);
		}

    });
}

/* La fonction qui met la video sur la page html,
et retourne l'id de la video demandé */
function TraitYoutube(response){

    if(response.data.items){
   
	$.each(response.data.items, function(i,data)
	{
	  var video_id=data.id;
	  var video_title=data.title;
	  var video_viewCount=data.viewCount;

	  var video_frame="<iframe width='350' height='300' src='http://www.youtube.com/embed/"+video_id+"' frameborder='0' type='text/html'></iframe>";

	  var final="<div id='title'>"+video_title+"</div><div>"+video_frame+"</div><div id='count'>"+video_viewCount+" Views</div>";
	  $("#resultatYoutube").html(final);
	});


    }
    else
	$("#resultatYoutube").html("<div id='no'>No Video</div>");
    
}
