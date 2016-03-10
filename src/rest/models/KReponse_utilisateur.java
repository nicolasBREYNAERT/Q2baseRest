package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.persistence.annotation.Id;


/**
* Classe KReponse_utilisateur
*/
@SuppressWarnings("serial")
@Entity
@Table(name="reponse_utilisateur")
public class KReponse_utilisateur extends KObject {
	@Id
	private int realisation_id;
	@Id
	private int reponse_id;
	private KRealisation realisation;
	private KReponse reponse;

	public KReponse_utilisateur() {
		super();
		//belongsTo(KReponse.class);belongsTo(KRealisation.class);
	}
	/**
	 * return the value of realisation_id
	 * @return realisation_id
	 */
	public int getRealisation_id(){
		return this.realisation_id;
	}
	/**
	 * return the value of reponse_id
	 * @return reponse_id
	 */
	public int getReponse_id(){
		return this.reponse_id;
	}
	/**
	 * return the value of realisation
	 * @return realisation
	 */
	public KRealisation getRealisation(){
		return this.realisation;
	}
	/**
	 * return the value of reponse
	 * @return reponse
	 */
	public KReponse getReponse(){
		return this.reponse;
	}

	/**
	 * set the value of realisation_id
	 * @param aRealisation_id
	 */
	public void setRealisation_id(int aRealisation_id){
		this.realisation_id=aRealisation_id;
	}
	/**
	 * set the value of reponse_id
	 * @param aReponse_id
	 */
	public void setReponse_id(int aReponse_id){
		this.reponse_id=aReponse_id;
	}
	/**
	 * set the value of realisation
	 * @param aRealisation
	 */
	public void setRealisation(KRealisation aRealisation){
		this.realisation=aRealisation;
	}
	/**
	 * set the value of reponse
	 * @param aReponse
	 */
	public void setReponse(KReponse aReponse){
		this.reponse=aReponse;
	}
	@Override
	public String toString() {
		return " [reponse_id] = " + reponse_id+" [realisation_id] = " + realisation_id;
	}
}