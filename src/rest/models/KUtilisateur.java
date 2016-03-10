package rest.models;

import net.ko.kobject.KObject;
import net.ko.persistence.annotation.Entity;
import net.ko.persistence.annotation.Table;
import net.ko.kobject.KListObject;


/**
* Classe KUtilisateur
*/
@SuppressWarnings("serial")
@Entity
@Table(name="utilisateur")
public class KUtilisateur extends KObject {
	private String mail;
	private String nom;
	private String password;
	private String prenom;
	private int rang_id;
	private KRang rang;
	private KListObject<KGroupe_utilisateur> groupe_utilisateurs;
	private KListObject<KRealisation> realisations;

	public KUtilisateur() {
		super();
		//hasMany(KRealisation.class);hasMany(KGroupe_utilisateur.class);belongsTo(KRang.class);
	}
	/**
	 * return the value of mail
	 * @return mail
	 */
	public String getMail(){
		return this.mail;
	}
	/**
	 * return the value of nom
	 * @return nom
	 */
	public String getNom(){
		return this.nom;
	}
	/**
	 * return the value of password
	 * @return password
	 */
	public String getPassword(){
		return this.password;
	}
	/**
	 * return the value of prenom
	 * @return prenom
	 */
	public String getPrenom(){
		return this.prenom;
	}
	/**
	 * return the value of rang_id
	 * @return rang_id
	 */
	public int getRang_id(){
		return this.rang_id;
	}
	/**
	 * return the value of rang
	 * @return rang
	 */
	public KRang getRang(){
		return this.rang;
	}
	/**
	 * return the value of groupe_utilisateurs
	 * @return groupe_utilisateurs
	 */
	public KListObject<KGroupe_utilisateur> getGroupe_utilisateurs(){
		return this.groupe_utilisateurs;
	}
	/**
	 * return the value of realisations
	 * @return realisations
	 */
	public KListObject<KRealisation> getRealisations(){
		return this.realisations;
	}

	/**
	 * set the value of mail
	 * @param aMail
	 */
	public void setMail(String aMail){
		this.mail=aMail;
	}
	/**
	 * set the value of nom
	 * @param aNom
	 */
	public void setNom(String aNom){
		this.nom=aNom;
	}
	/**
	 * set the value of password
	 * @param aPassword
	 */
	public void setPassword(String aPassword){
		this.password=aPassword;
	}
	/**
	 * set the value of prenom
	 * @param aPrenom
	 */
	public void setPrenom(String aPrenom){
		this.prenom=aPrenom;
	}
	/**
	 * set the value of rang_id
	 * @param aRang_id
	 */
	public void setRang_id(int aRang_id){
		this.rang_id=aRang_id;
	}
	/**
	 * set the value of rang
	 * @param aRang
	 */
	public void setRang(KRang aRang){
		this.rang=aRang;
	}
	/**
	 * set the value of groupe_utilisateurs
	 * @param aGroupe_utilisateurs
	 */
	public void setGroupe_utilisateurs(KListObject<KGroupe_utilisateur> aGroupe_utilisateurs){
		this.groupe_utilisateurs=aGroupe_utilisateurs;
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
		return " [prenom] = " + prenom+" [mail] = " + mail+" [rang_id] = " + rang_id+" [password] = " + password+" [nom] = " + nom;
	}
}