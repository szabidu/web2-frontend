/**
 * This class is generated by jOOQ
 */
package hu.tilos.radio.jooqmodel.tables.pojos;

/**
 * This class is generated by jOOQ.
 */
@javax.annotation.Generated(value    = { "http://www.jooq.org", "3.4.2" },
                            comments = "This class is generated by jOOQ")
@java.lang.SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Url implements java.io.Serializable {

	private static final long serialVersionUID = 488290352;

	private java.lang.Integer id;
	private java.lang.String  url;
	private java.lang.String  type;

	public Url() {}

	public Url(
		java.lang.Integer id,
		java.lang.String  url,
		java.lang.String  type
	) {
		this.id = id;
		this.url = url;
		this.type = type;
	}

	public java.lang.Integer getId() {
		return this.id;
	}

	public void setId(java.lang.Integer id) {
		this.id = id;
	}

	public java.lang.String getUrl() {
		return this.url;
	}

	public void setUrl(java.lang.String url) {
		this.url = url;
	}

	public java.lang.String getType() {
		return this.type;
	}

	public void setType(java.lang.String type) {
		this.type = type;
	}
}