package rest.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/domaine")
public class Domaine extends RestBase {
	
	@GET
	@Path("/all")
	public String getAll(){
		return "alpha";
	}
}