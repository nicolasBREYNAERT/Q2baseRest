package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.persistence.annotation.Id;


/**
* Classe KGroupe_questionnaire
*/
@SuppressWarnings("serial")
@Entity
@Table(name="groupe_questionnaire")
public class KGroupe_questionnaire extends KObject {
	@Id
	private int groupe_id;
	@Id
	private int questionnaire_id;
	private KGroupe groupe;
	private KQuestionnaire questionnaire;

	public KGroupe_questionnaire() {
		super();
		//belongsTo(KQuestionnaire.class);belongsTo(KGroupe.class);
	}
	/**
	 * return the value of groupe_id
	 * @return groupe_id
	 */
	public int getGroupe_id(){
		return this.groupe_id;
	}
	/**
	 * return the value of questionnaire_id
	 * @return questionnaire_id
	 */
	public int getQuestionnaire_id(){
		return this.questionnaire_id;
	}
	/**
	 * return the value of groupe
	 * @return groupe
	 */
	public KGroupe getGroupe(){
		return this.groupe;
	}
	/**
	 * return the value of questionnaire
	 * @return questionnaire
	 */
	public KQuestionnaire getQuestionnaire(){
		return this.questionnaire;
	}

	/**
	 * set the value of groupe_id
	 * @param aGroupe_id
	 */
	public void setGroupe_id(int aGroupe_id){
		this.groupe_id=aGroupe_id;
	}
	/**
	 * set the value of questionnaire_id
	 * @param aQuestionnaire_id
	 */
	public void setQuestionnaire_id(int aQuestionnaire_id){
		this.questionnaire_id=aQuestionnaire_id;
	}
	/**
	 * set the value of groupe
	 * @param aGroupe
	 */
	public void setGroupe(KGroupe aGroupe){
		this.groupe=aGroupe;
	}
	/**
	 * set the value of questionnaire
	 * @param aQuestionnaire
	 */
	public void setQuestionnaire(KQuestionnaire aQuestionnaire){
		this.questionnaire=aQuestionnaire;
	}
	@Override
	public String toString() {
		return " [groupe_id] = " + groupe_id+" [questionnaire_id] = " + questionnaire_id;
	}
}