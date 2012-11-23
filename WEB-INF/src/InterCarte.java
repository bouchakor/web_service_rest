import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.graphstream.graph.Node;
import org.graphstream.graph.Path;


public class InterCarte extends HttpServlet{

	private static final long serialVersionUID = 1;
	
	public static Carte carte=new Carte();

	public void doGet( HttpServletRequest req, HttpServletResponse res )throws ServletException, IOException{
			
		// recuperation des noms de ville
		String villeDepart=req.getParameter( "villeDep" );
		String villeDestination=req.getParameter( "villeDest" );
		
		
		// Calcul du chemin entre la ville de depart et la ville d'arrive
		Path chemin=carte.getPathBetween(villeDepart, villeDestination);
		List<Node> path=chemin.getNodePath();
		double distanceTotal=chemin.getPathWeight("distance");
		
		
		// Formation du retour XML
		StringBuilder returnXML= new StringBuilder("\r\n<path>\n");

		for(int i=0;i<path.size();i++){
			
			returnXML.append("<ville>\n");
				returnXML.append("<numero>");
					returnXML.append((i+1));
				returnXML.append("</numero>\n");
				returnXML.append("<nom>");
					returnXML.append(path.get(i));
				returnXML.append("</nom>\n");
			returnXML.append("</ville>\n");
			
		}

		
		//ajout du nombre de Kilometre total
		returnXML.append("<distance>\n");
		returnXML.append(distanceTotal);
		returnXML.append("\n</distance>\n");

		
		returnXML.append("</path>\n");

		res.setContentType("text/xml");
		res.setHeader("Cache-Control","no-cache");
		res.getWriter().write(returnXML.toString());
	}
}
