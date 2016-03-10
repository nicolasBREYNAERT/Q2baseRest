package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KQuestionnaire
*/
@SuppressWarnings("serial")
@Entity
@Table(name="questionnaire")
public class KQuestionnaire extends KObject {
	private java.sql.Date date;
	private int domaine_id;
	private String libelle;
	private KDomaine domaine;
	private KListObject<KGroupe_questionnaire> groupe_questionnaires;
	private KListObject<KQuestion> questions;
	private KListObject<KRealisation> realisations;

	public KQuestionnaire() {
		super();
		//hasMany(KRealisation.class);hasMany(KQuestion.class);hasMany(KGroupe_questionnaire.class);belongsTo(KDomaine.class);
	}
	/**
	 * return the value of date
	 * @return date
	 */
	public java.sql.Date getDate(){
		return this.date;
	}
	/**
	 * return the value of domaine_id
	 * @return domaine_id
	 */
	public int getDomaine_id(){
		return this.domaine_id;
	}
	/**
	 * return the value of libelle
	 * @return libelle
	 */
	public String getLibelle(){
		return this.libelle;
	}
	/**
	 * return the value of domaine
	 * @return domaine
	 */
	public KDomaine getDomaine(){
		return this.domaine;
	}
	/**
	 * return the value of groupe_questionnaires
	 * @return groupe_questionnaires
	 */
	public KListObject<KGroupe_questionnaire> getGroupe_questionnaires(){
		return this.groupe_questionnaires;
	}
	/**
	 * return the value of questions
	 * @return questions
	 */
	public KListObject<KQuestion> getQuestions(){
		return this.questions;
	}
	/**
	 * return the value of realisations
	 * @return realisations
	 */
	public KListObject<KRealisation> getRealisations(){
		return this.realisations;
	}

	/**
	 * set the value of date
	 * @param aDate
	 */
	public void setDate(java.sql.Date aDate){
		this.date=aDate;
	}
	/**
	 * set the value of domaine_id
	 * @param aDomaine_id
	 */
	public void setDomaine_id(int aDomaine_id){
		this.domaine_id=aDomaine_id;
	}
	/**
	 * set the value of libelle
	 * @param aLibelle
	 */
	public void setLibelle(String aLibelle){
		this.libelle=aLibelle;
	}
	/**
	 * set the value of domaine
	 * @param aDomaine
	 */
	public void setDomaine(KDomaine aDomaine){
		this.domaine=aDomaine;
	}
	/**
	 * set the value of groupe_questionnaires
	 * @param aGroupe_questionnaires
	 */
	public void setGroupe_questionnaires(KListObject<KGroupe_questionnaire> aGroupe_questionnaires){
		this.groupe_questionnaires=aGroupe_questionnaires;
	}
	/**
	 * set the value of questions
	 * @param aQuestions
	 */
	public void setQuestions(KListObject<KQuestion> aQuestions){
		this.questions=aQuestions;
	}
	/**
	 * set the value of realisations
	 * @param aRealisations
	 */
	public void setRealisations(KListObject<KRealisation> aRealisations){
		this.realisations=aRealisations;
	}
	@Override
	public String toString() {
		return " [libelle] = " + libelle+" [date] = " + date+" [domaine_id] = " + domaine_id;
	}
}