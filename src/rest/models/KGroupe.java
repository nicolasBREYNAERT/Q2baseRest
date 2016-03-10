package rest.models;
import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KGroupe
*/
@SuppressWarnings("serial")
@Entity
@Table(name="groupe")
public class KGroupe extends KObject {
	private String code;
	private String libelle;
	private KListObject<KGroupe_questionnaire> groupe_questionnaires;
	private KListObject<KGroupe_utilisateur> groupe_utilisateurs;

	public KGroupe() {
		super();
		//hasMany(KGroupe_utilisateur.class);hasMany(KGroupe_questionnaire.class);
	}
	/**
	 * return the value of code
	 * @return code
	 */
	public String getCode(){
		return this.code;
	}
	/**
	 * return the value of libelle
	 * @return libelle
	 */
	public String getLibelle(){
		return this.libelle;
	}
	/**
	 * return the value of groupe_questionnaires
	 * @return groupe_questionnaires
	 */
	public KListObject<KGroupe_questionnaire> getGroupe_questionnaires(){
		return this.groupe_questionnaires;
	}
	/**
	 * return the value of groupe_utilisateurs
	 * @return groupe_utilisateurs
	 */
	public KListObject<KGroupe_utilisateur> getGroupe_utilisateurs(){
		return this.groupe_utilisateurs;
	}

	/**
	 * set the value of code
	 * @param aCode
	 */
	public void setCode(String aCode){
		this.code=aCode;
	}
	/**
	 * set the value of libelle
	 * @param aLibelle
	 */
	public void setLibelle(String aLibelle){
		this.libelle=aLibelle;
	}
	/**
	 * set the value of groupe_questionnaires
	 * @param aGroupe_questionnaires
	 */
	public void setGroupe_questionnaires(KListObject<KGroupe_questionnaire> aGroupe_questionnaires){
		this.groupe_questionnaires=aGroupe_questionnaires;
	}
	/**
	 * set the value of groupe_utilisateurs
	 * @param aGroupe_utilisateurs
	 */
	public void setGroupe_utilisateurs(KListObject<KGroupe_utilisateur> aGroupe_utilisateurs){
		this.groupe_utilisateurs=aGroupe_utilisateurs;
	}
	@Override
	public String toString() {
		return " [libelle] = " + libelle+" [code] = " + code;
	}
}