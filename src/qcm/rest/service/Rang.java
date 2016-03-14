package qcm.rest.service;

import javax.ws.rs.Path;

import qcm.models.KRang;

@Path("/rang")

public class Rang extends CrudRestBase{
	public Rang() {
		kobjectClass = KRang.class;
		displayName = "rang";
	}
}
