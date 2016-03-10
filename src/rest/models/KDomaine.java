package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KDomaine
*/
@SuppressWarnings("serial")
@Entity
@Table(name="domaine")
public class KDomaine extends KObject {
	private String libelle;
	private KListObject<KQuestionnaire> questionnaires;

	public KDomaine() {
		super();
		//hasMany(KQuestionnaire.class);
	}
	/**
	 * return the value of libelle
	 * @return libelle
	 */
	public String getLibelle(){
		return this.libelle;
	}
	/**
	 * return the value of questionnaires
	 * @return questionnaires
	 */
	public KListObject<KQuestionnaire> getQuestionnaires(){
		return this.questionnaires;
	}

	/**
	 * set the value of libelle
	 * @param aLibelle
	 */
	public void setLibelle(String aLibelle){
		this.libelle=aLibelle;
	}
	/**
	 * set the value of questionnaires
	 * @param aQuestionnaires
	 */
	public void setQuestionnaires(KListObject<KQuestionnaire> aQuestionnaires){
		this.questionnaires=aQuestionnaires;
	}
	@Override
	public String toString() {
		return " [libelle] = " + libelle;
	}
}