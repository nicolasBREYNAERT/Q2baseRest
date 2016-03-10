package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KQuestion
*/
@SuppressWarnings("serial")
@Entity
@Table(name="question")
public class KQuestion extends KObject {
	private String libelle;
	private int questionnaire_id;
	private KListObject<KReponse> reponses;
	private KQuestionnaire questionnaire;

	public KQuestion() {
		super();
		//belongsTo(KQuestionnaire.class);hasMany(KReponse.class);
	}
	/**
	 * return the value of libelle
	 * @return libelle
	 */
	public String getLibelle(){
		return this.libelle;
	}
	/**
	 * return the value of questionnaire_id
	 * @return questionnaire_id
	 */
	public int getQuestionnaire_id(){
		return this.questionnaire_id;
	}
	/**
	 * return the value of reponses
	 * @return reponses
	 */
	public KListObject<KReponse> getReponses(){
		return this.reponses;
	}
	/**
	 * return the value of questionnaire
	 * @return questionnaire
	 */
	public KQuestionnaire getQuestionnaire(){
		return this.questionnaire;
	}

	/**
	 * set the value of libelle
	 * @param aLibelle
	 */
	public void setLibelle(String aLibelle){
		this.libelle=aLibelle;
	}
	/**
	 * set the value of questionnaire_id
	 * @param aQuestionnaire_id
	 */
	public void setQuestionnaire_id(int aQuestionnaire_id){
		this.questionnaire_id=aQuestionnaire_id;
	}
	/**
	 * set the value of reponses
	 * @param aReponses
	 */
	public void setReponses(KListObject<KReponse> aReponses){
		this.reponses=aReponses;
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
		return " [libelle] = " + libelle+" [questionnaire_id] = " + questionnaire_id;
	}
}