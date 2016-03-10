package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.persistence.annotation.Id;


/**
* Classe KGroupe_utilisateur
*/
@SuppressWarnings("serial")
@Entity
@Table(name="groupe_utilisateur")
public class KGroupe_utilisateur extends KObject {
	@Id
	private int groupe_id;
	@Id
	private int utilisateur_id;
	private KGroupe groupe;
	private KUtilisateur utilisateur;

	public KGroupe_utilisateur() {
		super();
		//belongsTo(KUtilisateur.class);belongsTo(KGroupe.class);
	}
	/**
	 * return the value of groupe_id
	 * @return groupe_id
	 */
	public int getGroupe_id(){
		return this.groupe_id;
	}
	/**
	 * return the value of utilisateur_id
	 * @return utilisateur_id
	 */
	public int getUtilisateur_id(){
		return this.utilisateur_id;
	}
	/**
	 * return the value of groupe
	 * @return groupe
	 */
	public KGroupe getGroupe(){
		return this.groupe;
	}
	/**
	 * return the value of utilisateur
	 * @return utilisateur
	 */
	public KUtilisateur getUtilisateur(){
		return this.utilisateur;
	}

	/**
	 * set the value of groupe_id
	 * @param aGroupe_id
	 */
	public void setGroupe_id(int aGroupe_id){
		this.groupe_id=aGroupe_id;
	}
	/**
	 * set the value of utilisateur_id
	 * @param aUtilisateur_id
	 */
	public void setUtilisateur_id(int aUtilisateur_id){
		this.utilisateur_id=aUtilisateur_id;
	}
	/**
	 * set the value of groupe
	 * @param aGroupe
	 */
	public void setGroupe(KGroupe aGroupe){
		this.groupe=aGroupe;
	}
	/**
	 * set the value of utilisateur
	 * @param aUtilisateur
	 */
	public void setUtilisateur(KUtilisateur aUtilisateur){
		this.utilisateur=aUtilisateur;
	}
	@Override
	public String toString() {
		return " [groupe_id] = " + groupe_id+" [utilisateur_id] = " + utilisateur_id;
	}
}