/**
 * 1- Probleme initialisation de la carte : OK
 * 2- Probleme consommation events souris : OK
 * 3- Probleme "nom du tiles": regl√© par blocage des marge innerDiv negative
 * 4- Probleme carte "mang√©": idem
 * 5- Probleme de zoom non centr√©: OK
 */


/**
 * Variables partag√©es entre les diff√©rentes fonctions.
 */
var dragging = false;
var top;
var left;
var dragStartTop;
var dragStartLeft;

var tileSize       = 100;
var viewportWidth  = 600;
var viewportHeight = 600;

var centreX;
var centreY;
var isDragging = false;
var objectToDrag;
var obj;
var ecartX;
var ecartY;
var curX;
var curY;


// Variable qui contient le niveau de zoom
var zoom;

// Variable qui contient les tailles d'images
var tailleImage=[
	[900,800],
	[1200,1000],
	[1400,1200],
	[1700,1400],
	[1900,1600],
];

/**
 * Variable qui contient les positions des villes au zoom 0
 */
var positionVille={
		amily : [710,320],
		arthenay : [233,240],
		bellgrade :[537,300],
		chateauneuf_sur_loire:[420,410],
		gien:[650,550],
		la_fierte_saint_aubin:[260,530],
		montargis:[685,295],
		olivet:[243,420],
		ouzouer_sur_loire:[555,490],
		orleans:[240,385],
		pithiviers :[435,163],                                                                                          
};





/**
 * Initialisation.
 * On rep√®re le DIV externe et on lui ajoute des callbacks pour les
 * √©venements :
 * 		- clic de souris : d√©buter le mouvement et changer le curseur.
 * 		- mouvement souris : bouger le DIV interne si mouvement d√©but√©.
 * 		- relachement du bouton souris : remettre le curseur.
 */



$(document).ready(function() {
	//empecher de perdre le service lors du drag de la page html
	$("#Maps").draggable({ containment: 'parent' });
	//separer le drag de la carte du service
	$("#Maps-menubarOuter").draggable({ cancel: ".ui-widget-header",containment: 'parent'  });
	
	 //maximisÈe le service
        $('#MapsFull').click(function () {
	  
	   //montrer les resultats 
	    $('#selectVille').show();
	    $('#itineraire').show();
	    //cacher tous les autres services
	    $('#design_search').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:0,
	      
	      
	    });
	    $('#Rss').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:602,
	      
	      
	    });
	    $('#google').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:897,
	      
	      
	    });
	    $('#Youtube').animate({
		
	    	width: "25%",
		height: "5%",
		top:1043,
		left:301,
	      
	      
	    });
	    
	    //desactiver le drage en mode aggrandir
	    $('#Maps').draggable("disable");
	    //mettre les serives dans la bare
	    $('#google_contents').hide();
	    $('#Youtube-contents').hide();
	    $('#SelectRss').hide();
	    $('#GoRss').hide();
	    $('#design_search_contents').hide();
	    $('#Rssresults').hide();
	    $('#resultat').hide(); 
	
	   //maintenant maximisÈe le service
	    $('#Maps').animate({ 
	        top:0,
		left:0,
		width: "100%",
		height: "94.5%",	
	      }, 15);
	    
	      //dÈmaximisÈe le service
	    $('#MapsBar').click(function () {
		  $('#design_search').show();
		  $('#Rss').show();
		  $('#google').show();
		  $('#Maps').draggable("enable");
		  $('#Maps').animate({ 
		      width: "40%",
		      height: "40%",
		    }, 10 );
	    });
      
	});
	
    	// fermer le service
	$('#MapsClose').click(function () {
	    $('#Maps').hide();
	});
	
	// Ouverir la carte du service 
	$('#ouvrir').click(function () {
	    $('#outerDiv').show();
	    $('#Maps-menubarOuter').show();
	    
	});
	
	//fermer la carte du service
	$('#fermer').click(function () {
	    $('#outerDiv').hide();
	    $('#Maps-menubarOuter').hide();
	    
	});

	/* Boutton de navigation Nord Sud Est West*/
	$('#n').click(function () {
	    move(50,0);
	});
	$('#s').click(function () {
	    move(-50,0);
	});
	$('#e').click(function () {
	    move(0,-50);
	});
	$('#w').click(function () {
	    move(0,50);
	});


});


function init() {
	zoom=0;
	setInnerDivSize(tailleImage[zoom][0], tailleImage[zoom][1]);

	var outerDiv = document.getElementById( "outerDiv" );

	outerDiv.onmousedown = startMove;
	outerDiv.onmousemove = processMove;
	outerDiv.onmouseup   = stopMove;
	outerDiv.ondragstart = function() { return false; }
	
	var selectDepart=document.getElementById('depart');
	selectDepart.onchange=function(){ 
		affichePunaise('depart',selectDepart.value);
	}
	
	var selectDestination=document.getElementById('destination');
	selectDestination.onchange=function(){ 
		affichePunaise('destination',selectDestination.value);
	}
	
	
	document.getElementById('calcul').onclick=getItineraire;

	var zPlus = document.getElementById( "zoomPlus" );
	zPlus.onmousedown = zoomPlus;

	var zMoins = document.getElementById( "zoomMoins" );
	zMoins.onmousedown = zoomMoins;
	
	checkTiles();
	
	// Initialisation du scroll 
	if (window.addEventListener) //pour mozilla
        	outerDiv.addEventListener('DOMMouseScroll', wheel, false);

	//pour EI/Opera
	outerDiv.onmousewheel = outerDiv.onmousewheel = wheel;
	
	
	
	// initialisation des liste de ville
	document.getElementById('depart').options[0].selected=true;
	document.getElementById('destination').options[0].selected=true;;

}


/**
 * Fonction qui va affich√© la punaise sur la ville choisie
 * type = depart ou destination
 * ville= nom de la ville
 **/
function affichePunaise(type,ville){
	
	// on doit commencÈ par supprimÈ toutes les punaises des points de passages si elle existe
	var imgs = document.getElementById('divPunaise').getElementsByTagName( "img" );
	var tab=new Array();

	for( i=0; i<imgs.length; i++ ) {
		var id = imgs[i].getAttribute( "id" );
		var regex_punaise=/punaise_[0-9]+/;
		if(regex_punaise.test(id))
			tab.push(imgs[i]);
		
	}
	
	for(var i=0;i<tab.length;i++)
		document.getElementById('divPunaise').removeChild(tab[i]);

	//et supprimer la liste de l'itineraire
	document.getElementById('listeItineraire').innerHTML='';
	
	// On place enfin la punaise
	
	//calcul du ratio pour le deplacement des punaises
	var ratioX=tailleImage[zoom][0]/tailleImage[0][0];
	var ratioY=tailleImage[zoom][1]/tailleImage[0][1];
	
	if(type=="depart"){
		
		// on supprime l'ancien depoint de part si il exite
		var punaise_pred=document.getElementById('punaise_depart');
		if(punaise_pred)
			document.getElementById('divPunaise').removeChild(punaise_pred);
		
		if(ville!='-----'){
			
				
	
			var punaise=document.createElement('img');
			punaise.id='punaise_depart';
			punaise.src='./resources/punaise_depart.png';
			punaise.alt='punaise ville depart';
			punaise.title=Premiere(ville);
			punaise.setAttribute('ville',ville);
			punaise.setAttribute('class','punaise');
			punaise.setAttribute('style','position: absolute;left:'+Math.floor(positionVille[ville][0]*ratioY)+'px;top:'+Math.floor(positionVille[ville][1]*ratioX)+'px;');
			document.getElementById('divPunaise').appendChild(punaise);
		}
		
		
	}
	else if(type=="destination"){
		// on supprime l'ancien point de destination si il exite
		var punaise_pred=document.getElementById('punaise_destination');
		if(punaise_pred)
			document.getElementById('divPunaise').removeChild(punaise_pred);
		
		if(ville!='-----'){
		
	
			var punaise=document.createElement('img');
			punaise.id='punaise_destination';
			punaise.src='./resources/punaise_destination.png';
			punaise.alt='punaise ville destination';
			punaise.title=Premiere(ville);
			punaise.setAttribute('ville',ville);
			punaise.setAttribute('class','punaise');
			punaise.setAttribute('style','position: absolute;left:'+Math.floor(positionVille[ville][0]*ratioY)+'px;top:'+Math.floor(positionVille[ville][1]*ratioX)+'px;');
			document.getElementById('divPunaise').appendChild(punaise);
		}
		
	
	}
}

/**
 * methode qui permet de mettre en majuscule la premiere lettre d'une string
 * @param chaine a travailler
 * @returns chaine avec la premiere lettre en majuscule
 */
function Premiere(chaine){
	return chaine.substr(0,1).toUpperCase()+chaine.substr(1,chaine.length).toLowerCase();	
}

/**
 * Gestion de l'evenement de scroll
 */
function wheel(event){
        var delta = 0;
        if (!event)//pour IE
                event = window.event;
        if (event.wheelDelta) // IE / Opera
                delta = event.wheelDelta/120;
        else if (event.detail)// Pour mozilla
                delta = -event.detail/3;
        
        if (delta)
                handle(delta);
       
        if (event.preventDefault)
                event.preventDefault();       
	event.returnValue = false;
}

/**
 * Attachement des fonctions de zoom en fonction du sens de scroll
 */
function handle(delta) {
        if (delta < 0)
			zoomMoins();
        else
			zoomPlus();
}

/**
 * Fonction qui permet de zoomer
 */
function zoomPlus(  ){
	
	if(zoom<4){
		var new_zoom=zoom+1;
		if(zoom != new_zoom)	
		calculCentre(zoom,new_zoom);
		setInnerDivSize(tailleImage[zoom][0], tailleImage[zoom][1]);
		zoom = new_zoom;
		var innerDiv = document.getElementById( "innerDiv" );
		t= stripPx( innerDiv.style.top );
		l= stripPx( innerDiv.style.left );
		checkInnerDiv(t, l);
		//corrigeZoom("plus");
		checkTiles();
		
	}
}

function zoomMoins(  ){
	var new_zoom=zoom-1;
	if(new_zoom<0)
		new_zoom=0;
	
	if(zoom != new_zoom)	
		calculCentre(zoom,new_zoom);
	setInnerDivSize(tailleImage[new_zoom][0], tailleImage[new_zoom][1]);
	zoom = new_zoom;
	var innerDiv = document.getElementById( "innerDiv" );
	t= stripPx( innerDiv.style.top );
	l= stripPx( innerDiv.style.left );
	checkInnerDiv(t, l);
	//corrigeZoom("moins");
	checkTiles();
}

/**
 * Fonction qui permet de recadrer le zoom
 * et de replacer les punnaises
 */
function calculCentre(old_zoom , new_zoom){
	var innerDiv = document.getElementById( 'innerDiv' );
	
	var centreX;
	var centreY;
	var width= viewportWidth;
	var height= viewportHeight;
	var topI=stripPx( innerDiv.style.left );
	var leftI=stripPx( innerDiv.style.top );
	
	centreX = topI - width/2;
	centreY = leftI - height/2;
	
	var ratioX =  tailleImage[new_zoom][0]/ tailleImage[old_zoom][0];
	var ratioY =  tailleImage[new_zoom][1] / tailleImage[old_zoom][1];

	centreX	= centreX*ratioX ;
	centreY = centreY*ratioY ;

	topI=(centreY+ height/2);
	leftI=(centreX+ width/2);
	
	if(topI>0)
		topI=0;
	if(leftI>0)
		leftI=0;
	innerDiv.style.top  = topI  + "px";
	innerDiv.style.left = leftI + "px";
	
	//maintenant on va replacer les punaises (si elle existe) aprÈs le zoom
	var imgs = innerDiv.getElementsByTagName( "img" );
	var diffX=tailleImage[new_zoom][0]/tailleImage[0][0];
	var diffY=tailleImage[new_zoom][1]/tailleImage[0][1];
	
	for( i=0; i<imgs.length; ++i ) {
		var id = imgs[i].getAttribute( "id" );
		
		// on test si il s'agit pas d'une tiles
		var regex_tiles=/x[0-9]+y[0-9]+z[0-9]+/;
		if(!regex_tiles.test(id)){
			var ville=imgs[i].getAttribute('ville');	
			imgs[i].setAttribute('style','position: absolute;left:'+Math.floor(positionVille[ville][0]*diffY)+'px;top:'+Math.floor(positionVille[ville][1]*diffX)+'px;');

		}
	}
	

}

function move(dx, dy) {
    
     
	innerDiv = document.getElementById('innerDiv');
	outerDiv = document.getElementById('outerDiv');
	var t=top  + dx;
	var l=left + dy;
    
	innerDiv.style.top = (stripPx(innerDiv.style.top) + dy) + 'px';
	innerDiv.style.left = (stripPx(innerDiv.style.left) + dx) + 'px';
	checkInnerDiv(t, l);
	checkTiles();
}

function startMove( event ) {
	if( ! event )
		event = window.event;

	dragStartLeft = event.clientX;
	dragStartTop  = event.clientY;

	var innerDiv = document.getElementById( "innerDiv" );

	innerDiv.style.cursor = "-moz-grab";
	top      = stripPx( innerDiv.style.top );
	left     = stripPx( innerDiv.style.left );
	dragging = true;

	return false;
}

function processMove( event ) {
	if( ! event )
		event = window.event;

	if( dragging ) {
		//evite que l'on sorte de l'image
		var t=top  + (event.clientY-dragStartTop);
		var l=left + (event.clientX-dragStartLeft);
		checkInnerDiv(t, l);
		checkTiles();
	}

	
}

/**
 * Fonction qui permet de bloquer le deplacement de l'image
 * Empeche les marges positive pour innerDiv
 */
function checkInnerDiv(t, l){
	if(t>0)
		t=0;
	if(t<(-1*tailleImage[zoom][1]+viewportHeight))
		t=-1*tailleImage[zoom][1]+viewportHeight;
	if(l>0)
		l=0;
	if(l<(-1*tailleImage[zoom][0]+viewportWidth))
		l=-1*tailleImage[zoom][0]+viewportWidth;
	var innerDiv = document.getElementById( "innerDiv" );
	innerDiv.style.top  = t  + "px";
	innerDiv.style.left = l + "px";
}

function stopMove( event ) {
	var innerDiv = document.getElementById( "innerDiv" );
	innerDiv.style.cursor = "";
	dragging = false;
}

/**
 * On change la taille du DIV interne.
 */
function setInnerDivSize( width, height ) {
	var innerDiv = document.getElementById( "innerDiv" )
	innerDiv.style.width = width
	innerDiv.style.height = height
}

/**
 * Uniquement pour transformer une chaine de caract√®res avec le suffixe "px"
 * provenant de la feuille de style en nombre.
 */
function stripPx( value ) {
	if( value == "" ) return 0;
	return parseFloat( value.substring( 0, value.length - 2 ) );
}            	

function checkTiles() {
	var visibleTiles    = getVisibleTiles();
	var innerDiv        = document.getElementById( "innerDiv" );
	var visibleTilesMap = {};

	for( i = 0; i < visibleTiles.length; ++i ) { 
		var tileArray = visibleTiles[i];
		var tileName  = "x" + tileArray[0] + "y" + tileArray[1] + "z" + zoom;
		var img       = document.getElementById( tileName );

		visibleTilesMap[tileName] = true;

		if( ! img ) {
			img = document.createElement( "img" );
			
			img.src            = "resources/tiles/" + tileName + ".jpg";
			img.style.position = "absolute";
			img.style.left     = (tileArray[0] * tileSize) + "px";
			img.style.top      = (tileArray[1] * tileSize) + "px";
			img.setAttribute( "id", tileName );
			
			innerDiv.appendChild( img );
		}
	}
	
	var imgs = innerDiv.getElementsByTagName( "img" );

	for( i=0; i<imgs.length; ++i ) {
		var id = imgs[i].getAttribute( "id" );
		
		// on test si il l'agit bien d'une tiles
		var regex_tiles=/x[0-9]+y[0-9]+z[0-9]+/;
		if(regex_tiles.test(id)){
			if( ! visibleTilesMap[id] ) {
				innerDiv.removeChild( imgs[i] );
				i--;
			}
		}
	}
}

function getVisibleTiles() {
	var innerDiv = document.getElementById( "innerDiv" );

	var mapX = stripPx( innerDiv.style.left );
	var mapY = stripPx( innerDiv.style.top );

	var startX = Math.abs( Math.floor( mapX / tileSize ))  - 1;
	if(startX<0)
		startX=0;
	var startY = Math.abs( Math.floor( mapY / tileSize )) - 1;
	if(startY<0)
		startY=0;
	var tilesX = Math.ceil( viewportWidth / tileSize ) + 1;
	var tilesY = Math.ceil( viewportHeight / tileSize ) + 1;

	var visibleTileArray = [];
	var counter = 0;

	for( x = startX; x < (tilesX + startX); x++ ) {
		for( y = startY; y < (tilesY + startY); y++ ) {
			visibleTileArray[counter++] = [x, y];
		}
	}
    /*centre*/
	centreX = visibleTileArray[Math.floor(visibleTileArray.length/2)][0];
	centreY = visibleTileArray[Math.floor(visibleTileArray.length/2)][1];

    return visibleTileArray;
}


/***************************************** AJAX **********************************/

var req;

/**
 * Fonction qui va demandÈ a la partie java de faire le calcul d'itinÈraire
 */
function getItineraire(){

	var villeDepart=document.getElementById('depart').options[document.getElementById('depart').selectedIndex].text;
	var villeDestination=document.getElementById('destination').options[document.getElementById('destination').selectedIndex].text;
	
	// on test si il y a bien deux villes de selectionner et si elle ne sont pas egal
	if(villeDepart!='-----' && villeDestination!='-----' && villeDepart!=villeDestination){
			
		
		var url = "Maps?villeDep=" + escape( villeDepart ) +"&villeDest="+escape( villeDestination );
		req = new XMLHttpRequest();
		req.onreadystatechange = callback;
		req.open( "Get", url, true );
		req.send( null );
		
	}
	else if(villeDepart=='-----' || villeDestination=='-----')
		alert("Vous devez choisir deux villes");
	else if (villeDepart==villeDestination)
		alert("Vous devez choisir deux villes differentes");

		
	
}


function callback() {
	if( req.readyState == 4 ) {
		if( req.status == 200 ) {
	
			afficheItineraire();
		}
	}	
	//clear();
}


/**
 * Fonction appelÈ par la methode ce callback
 * Cette fonction va afficher les punaises de chaque point de passage et generer l'iteraire via les donnÈes XML renvoyÈ par la partie JAVA
 */
function afficheItineraire(){
	
	//recuperation du document XML
	var resp=req.responseText;
	var parser = new DOMParser();
	var dom = parser.parseFromString(resp, "text/xml");
	
	// calcul du ratio de zoom pour le placement des punaises
	var ratioX=tailleImage[zoom][0]/tailleImage[0][0];
	var ratioY=tailleImage[zoom][1]/tailleImage[0][1];	
	
	// recuperation de tous les points de passages
	var villes=dom.getElementsByTagName("ville");
	
	var affichage="<ol>";
	for (var i =0 ; i<villes.length;i++){

		var numVille=villes[i].childNodes[1].textContent;
		var nomVilleOrigine=villes[i].childNodes[3].textContent;

		// on remplace les - et les espaces par des underscore 
		var nomVille=nomVilleOrigine.replace(/[- ]/g,"_");


		// si ce n'est pas la derniere ou la premiere ville, on affiche les punaises
		if(i!=0 && i<(villes.length-1)){
			
			// creation des punaises
			var punaise=document.createElement('img');
			punaise.id='punaise_'+numVille;
			punaise.src='./resources/punaise_'+numVille+'.png';
			punaise.alt='punaise ville '+numVille;
			punaise.title=Premiere(nomVilleOrigine);
			punaise.setAttribute('ville',nomVille);
			punaise.setAttribute('class','punaise');
			punaise.setAttribute('style','position: absolute;left:'+Math.floor(positionVille[nomVille][0]*ratioY)+'px;top:'+Math.floor(positionVille[nomVille][1]*ratioX)+'px;');
			document.getElementById('divPunaise').appendChild(punaise);
			
			
		}
		affichage+="<li>"+nomVilleOrigine+"</li>";
	}
	
	// on affiche le nombres de kilometre total
	var distance=dom.getElementsByTagName("distance")[0].textContent;
	affichage+="<li style='list-style-type:none;'>Distance: "+distance+"Km</li>";
	affichage+="</ol>";
	
	// on affiche dans la div d'itineraire 
	document.getElementById('listeItineraire').innerHTML=affichage;
}