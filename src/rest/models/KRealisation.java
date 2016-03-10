package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KRealisation
*/
@SuppressWarnings("serial")
@Entity
@Table(name="realisation")
public class KRealisation extends KObject {
	private java.sql.Date date;
	private int questionnaire_id;
	private int score;
	private int utilisateur_id;
	private KQuestionnaire questionnaire;
	private KListObject<KReponse_utilisateur> reponse_utilisateurs;
	private KUtilisateur utilisateur;

	public KRealisation() {
		super();
		//belongsTo(KUtilisateur.class);hasMany(KReponse_utilisateur.class);belongsTo(KQuestionnaire.class);
	}
	/**
	 * return the value of date
	 * @return date
	 */
	public java.sql.Date getDate(){
		return this.date;
	}
	/**
	 * return the value of questionnaire_id
	 * @return questionnaire_id
	 */
	public int getQuestionnaire_id(){
		return this.questionnaire_id;
	}
	/**
	 * return the value of score
	 * @return score
	 */
	public int getScore(){
		return this.score;
	}
	/**
	 * return the value of utilisateur_id
	 * @return utilisateur_id
	 */
	public int getUtilisateur_id(){
		return this.utilisateur_id;
	}
	/**
	 * return the value of questionnaire
	 * @return questionnaire
	 */
	public KQuestionnaire getQuestionnaire(){
		return this.questionnaire;
	}
	/**
	 * return the value of reponse_utilisateurs
	 * @return reponse_utilisateurs
	 */
	public KListObject<KReponse_utilisateur> getReponse_utilisateurs(){
		return this.reponse_utilisateurs;
	}
	/**
	 * return the value of utilisateur
	 * @return utilisateur
	 */
	public KUtilisateur getUtilisateur(){
		return this.utilisateur;
	}

	/**
	 * set the value of date
	 * @param aDate
	 */
	public void setDate(java.sql.Date aDate){
		this.date=aDate;
	}
	/**
	 * set the value of questionnaire_id
	 * @param aQuestionnaire_id
	 */
	public void setQuestionnaire_id(int aQuestionnaire_id){
		this.questionnaire_id=aQuestionnaire_id;
	}
	/**
	 * set the value of score
	 * @param aScore
	 */
	public void setScore(int aScore){
		this.score=aScore;
	}
	/**
	 * set the value of utilisateur_id
	 * @param aUtilisateur_id
	 */
	public void setUtilisateur_id(int aUtilisateur_id){
		this.utilisateur_id=aUtilisateur_id;
	}
	/**
	 * set the value of questionnaire
	 * @param aQuestionnaire
	 */
	public void setQuestionnaire(KQuestionnaire aQuestionnaire){
		this.questionnaire=aQuestionnaire;
	}
	/**
	 * set the value of reponse_utilisateurs
	 * @param aReponse_utilisateurs
	 */
	public void setReponse_utilisateurs(KListObject<KReponse_utilisateur> aReponse_utilisateurs){
		this.reponse_utilisateurs=aReponse_utilisateurs;
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
		return " [score] = " + score+" [questionnaire_id] = " + questionnaire_id+" [date] = " + date+" [utilisateur_id] = " + utilisateur_id;
	}
}