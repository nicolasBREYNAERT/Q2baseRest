package qcm.rest.service;

import javax.ws.rs.Path;

import qcm.models.KReponse;

@Path("/reponse")

public class Reponse extends CrudRestBase{
	public Reponse() {
		kobjectClass = KReponse.class;
		displayName = "rang";
	}
}
