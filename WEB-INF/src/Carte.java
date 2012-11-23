import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.graphstream.algorithm.Dijkstra;
import org.graphstream.algorithm.Dijkstra.Element;
import org.graphstream.graph.Edge;
import org.graphstream.graph.Node;
import org.graphstream.graph.Path;
import org.graphstream.graph.implementations.DefaultGraph;

/**
 * Classe qui gere la carte au niveau logique
 * 
 *
 */
public class Carte {

	
	/**
	 * Graphe de la carte
	 */
	DefaultGraph maps;
	
	/**
	 * Variables contenant tous les noms des villes
	 */
	ArrayList<String> villes;
	
	/**
	 * Constructeur de la carte
	 */
	public Carte(){
		
		// génération de la liste des villes
		villes=new ArrayList<String>();
		villes.add("orleans");
		villes.add("pithiviers");
		villes.add("bellgrade");
		villes.add("gien");
		villes.add("ouzouer-sur-loire");
		villes.add("chateauneuf-sur-loire");
		villes.add("olivet");
		villes.add("la fierte saint-aubin");
		villes.add("amily");
		villes.add("arthenay");
		villes.add("montargis");


		// generation du graph de la carte
		maps=new DefaultGraph("maps");
		maps.setStrict(false);
		maps.setAutoCreate(true);
		
		
		// chargement de toutes les villes au sein du graph
		for(String ville : villes)
			maps.addNode(ville);
		
		
		// generation des routes
		createRoadBetweenCities();
	}
	
	/**
	 * Fonction qui va créer les chemins entre les villes
	 */
	private void createRoadBetweenCities(){
		
		//construction des routes entres les villes
		maps.addEdge("orleans|arthenay", "orleans", "arthenay");
		maps.getEdge("orleans|arthenay").addAttribute("distance", 28.0); // le poids de l'arrete correspond au nombres dekilometre entre chaque ville
		
		maps.addEdge("orleans|pithiviers", "orleans", "pithiviers");
		maps.getEdge("orleans|pithiviers").addAttribute("distance", 57.0);
		
		maps.addEdge("orleans|bellgrade", "orleans", "bellgrade");
		maps.getEdge("orleans|bellgrade").addAttribute("distance", 52.0);
		
		maps.addEdge("orleans|montargis", "orleans", "montargis");
		maps.getEdge("orleans|montargis").addAttribute("distance", 74.0);
		
		maps.addEdge("orleans|chateauneuf-sur-loire", "orleans", "chateauneuf-sur-loire");
		maps.getEdge("orleans|chateauneuf-sur-loire").addAttribute("distance", 30.0);
		
		maps.addEdge("orleans|olivet", "orleans", "olivet");
		maps.getEdge("orleans|olivet").addAttribute("distance", 6.0);
		
		maps.addEdge("olivet|la fierte saint-aubin", "olivet", "la fierte saint-aubin");
		maps.getEdge("olivet|la fierte saint-aubin").addAttribute("distance", 18.0);

		maps.addEdge("montargis|amily", "montargis", "amily");
		maps.getEdge("montargis|amily").addAttribute("distance", 6.0);
		
		maps.addEdge("chateauneuf-sur-loire|ouzouer-sur-loire", "chateauneuf-sur-loire", "ouzouer-sur-loire");
		maps.getEdge("chateauneuf-sur-loire|ouzouer-sur-loire").addAttribute("distance", 25.0);

		maps.addEdge("ouzouer-sur-loire|gien", "ouzouer-sur-loire", "gien");
		maps.getEdge("ouzouer-sur-loire|gien").addAttribute("distance", 15.0);

		

	}
	
	/**
	 * Methode qui permet de connaitre le plus cour chemin entre deux villes
	 * @param depart ville de depart
	 * @param destination ville d'arrivé
	 * @return liste des villes a fanchir ( dans l'ordre)
	 */
	public Path getPathBetween(String depart,String destination){
		
		Dijkstra dij=new Dijkstra(Element.edge, "distance" , destination);
		dij.init(maps);
		dij.compute();
		
		Path path=dij.getShortestPath(maps.getNode(depart));
		
		return path;
	}
	
	/**
	 * Methode qui met en forme la carte
	 */
	private void setUI(){
		
		for(Node n:maps.getEachNode()){
			n.addAttribute("label", n.getId());
		}
		
		for(Edge e:maps.getEachEdge()){
			e.addAttribute("label",e.getAttribute("distance")+"Km");
		}
	
	}
	
	/**
	 * Methode qui permet de sauvegarder la carte au format dgs
	 */
	public void sauveMaps(){
		try {
			maps.write("carte.dgs");
		} catch (IOException e) {
			System.err.println("Erreur dans la sauvegarde de la carte");
		}
	}
	
	/**
	 * Fonction main
	 * seulement utile pour des test
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Carte m=new Carte();
		
		Path path=m.getPathBetween("la fierte saint-aubin", "gien");
		double taille=path.getPathWeight("distance");
		
		List<Node> chemin=path.getNodePath();		
		System.out.println("Chemin entre la fierte saint-aubin et gien");
		for(Node n:chemin)
			System.out.print("-->"+n.getId());
		
		System.out.println("\n"+taille+"Km");
		
		
		path=m.getPathBetween("arthenay", "amily");
		taille=path.getPathWeight("distance");
		chemin=path.getNodePath();
		
		System.out.println("\n\nChemin entre la arthenay et amily");
		for(Node n:chemin)
			System.out.print("-->"+n.getId());
		System.out.println("\n"+taille+"Km");
				
		//mise en forme de la carte
		m.setUI();
		
		//affichage de la carte
		m.maps.display();

		
				
	}

}
