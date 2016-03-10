package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KReponse
*/
@SuppressWarnings("serial")
@Entity
@Table(name="reponse")
public class KReponse extends KObject {
	private boolean good;
	private String libelle;
	private int question_id;
	private KQuestion question;
	private KListObject<KReponse_utilisateur> reponse_utilisateurs;

	public KReponse() {
		super();
		//hasMany(KReponse_utilisateur.class);belongsTo(KQuestion.class);
	}
	/**
	 * return the value of good
	 * @return good
	 */
	public boolean isGood(){
		return this.good;
	}
	/**
	 * return the value of libelle
	 * @return libelle
	 */
	public String getLibelle(){
		return this.libelle;
	}
	/**
	 * return the value of question_id
	 * @return question_id
	 */
	public int getQuestion_id(){
		return this.question_id;
	}
	/**
	 * return the value of question
	 * @return question
	 */
	public KQuestion getQuestion(){
		return this.question;
	}
	/**
	 * return the value of reponse_utilisateurs
	 * @return reponse_utilisateurs
	 */
	public KListObject<KReponse_utilisateur> getReponse_utilisateurs(){
		return this.reponse_utilisateurs;
	}

	/**
	 * set the value of good
	 * @param aGood
	 */
	public void setGood(boolean aGood){
		this.good=aGood;
	}
	/**
	 * set the value of libelle
	 * @param aLibelle
	 */
	public void setLibelle(String aLibelle){
		this.libelle=aLibelle;
	}
	/**
	 * set the value of question_id
	 * @param aQuestion_id
	 */
	public void setQuestion_id(int aQuestion_id){
		this.question_id=aQuestion_id;
	}
	/**
	 * set the value of question
	 * @param aQuestion
	 */
	public void setQuestion(KQuestion aQuestion){
		this.question=aQuestion;
	}
	/**
	 * set the value of reponse_utilisateurs
	 * @param aReponse_utilisateurs
	 */
	public void setReponse_utilisateurs(KListObject<KReponse_utilisateur> aReponse_utilisateurs){
		this.reponse_utilisateurs=aReponse_utilisateurs;
	}
	@Override
	public String toString() {
		return " [libelle] = " + libelle+" [good] = " + good+" [question_id] = " + question_id;
	}
}