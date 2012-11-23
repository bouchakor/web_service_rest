import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.net.URL;
import java.net.URLConnection;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.lang.StringBuilder ;

public class WebService extends HttpServlet {
	private static final long serialVersionUID = 1;

	public void doGet( HttpServletRequest req, HttpServletResponse res ) throws ServletException, IOException{
		/*String key="ABQIAAAAPf2nnbMU8jBNDCEpFQxsZhQ_eswkAUXL4ShrAGgQFRerlScB6BSnULQGDS2rvhaLNHUh6Cb-YbLudA";
		String v="1.0";*/
		String text=req.getParameter( "rest" );
		/*String userName="192.168.1.1";
		String adre="https://ajax.googleapis.com/ajax/services/search/web?";*/

		//String urlString=adre+"v="+v+"&q="+text+"&key="+key+"&userip="+userName;
	      
		URL url = new URL(text);
		URLConnection yc=url.openConnection();
		BufferedReader in = new BufferedReader(new InputStreamReader(yc.getInputStream()));
		String inputLine;
		StringBuilder sb = new StringBuilder();
		
		while((inputLine=in.readLine())!=null)
			sb.append(inputLine);
		
		in.close();
		res.setContentType("text/xml");
		res.setHeader("Cache-Control", "no-cache");
		res.getWriter().write(sb.toString());
	}	
}
