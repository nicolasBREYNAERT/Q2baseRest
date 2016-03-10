package rest.service;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

import net.ko.framework.KoHttp;

public class RestBase {
    @Context
    protected ServletContext context;
 
    @Context
    public void setServletContext(ServletContext context) {
        this.context = context;
        KoHttp.kstart(context);
    }
}
