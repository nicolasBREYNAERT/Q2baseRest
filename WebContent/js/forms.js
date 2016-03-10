/**
 * Forms
 * Utilitaires javascript pour KObject
 * @author jcheron
 * @link http://www.kobject.net/
 * @copyright Copyright kobject 2008-2013
 * @license http://www.kobject.net/index.php?option=com_content&view=article&id=50&Itemid=2  LGPL License
 * @version $Id: koLibrary-1.0.0.25c-1-beta1-js1$
 */

var $A = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0, length = iterable.length; i < length; i++)
      results.push(iterable[i]);
    return results;
  }
};

Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

Object.extend(Object, {
  inspect: function(object) {
    try {
      if (object === undefined) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : object.toString();
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

  toJSON: function(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (Object.isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = Object.toJSON(object[property]);
      if (value !== undefined)
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  },

  toQueryString: function(object) {
    return $H(object).toQueryString();
  },

  toHTML: function(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  },

  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  clone: function(object) {
    return Object.extend({ }, object);
  },

  isElement: function(object) {
    return object && object.nodeType == 1;
  },

  isArray: function(object) {
    return object && object.constructor === Array;
  },

  isHash: function(object) {
    return object instanceof Hash;
  },

  isFunction: function(object) {
    return typeof object == "function";
  },

  isString: function(object) {
    return typeof object == "string";
  },

  isNumber: function(object) {
    return typeof object == "number";
  },

  isUndefined: function(object) {
    return typeof object == "undefined";
  }
});

Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, {
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },	
   isJSON: function() {
    var str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  },
  trim: function () {
	    return this.replace(/^\s+|\s+$/gm, '');
  }
});


var Class={};
Class.create=function(classFille,classParent){
	if ( typeof classFille.initialized == "undefined" ) {
		for (var element in classParent.prototype ) {
			classFille.prototype[element] = classParent.prototype[element];}
	}
};
var keyCodes=new Array();
var Forms = {};//nameSpace
(function(){
	Forms.MessageDialog=function(id,title,content,submitFunction){
		Class.create(Forms.MessageDialog, Forms.LightBox);
		Forms.LightBox.call(this,id);
		this.init(title,content,submitFunction);
	};
	Forms.MessageDialog.prototype={
		submitFunction:null,
		innerSubmit:null,
		init:function(title,content,submitFunction){
			this.title=title;
			this.content=content;
			this.setSubmitFunction(submitFunction);
		},
		setSubmitFunction:function(submitFunction){
			this.submitFunction=submitFunction;
			var me=this;
			this.innerSubmit=function(obj){
				canclose=true;
				if(me.submitFunction!=null) {
					try{ canclose=me.submitFunction(me);}catch(ex){canclose=true;}
				}
				return canclose;
			};			
		},
		addButtons:function(buttons){
			if(typeof(buttons)=='string'){
				try{
					buttons=JSON.parse(buttons);
				}catch(ex){}
			}
			if(typeof(buttons)=='object')
			for(var bt in buttons){
				this.addAction(undefined,buttons[bt].caption,this.innerSubmit,buttons[bt].keycode);
			}
		},
		addButtonsWF:function(buttons){
			if(typeof(buttons)=='string'){
				try{
					buttons=JSON.parse(buttons);
				}catch(ex){}
			}
			if(typeof(buttons)=='object')
			for(var bt in buttons){
				this.addAction(undefined,buttons[bt].caption,buttons[bt].action,buttons[bt].keyCode,buttons[bt].glyphIcon);
			}
		},
		addButton:function(caption,keycode){
			this.addAction(undefined,caption,this.innerSubmit,keycode);
		}
	};
	
})();
(function(){ // début scope local
// déclaration de la classe LightBox
	Forms.LightBox = function(id){
		this.id=id;
		this.setAllContent();
		return this;
	};
	Forms.LightBox.prototype={
		id:'',
		title:'',
		content:'',
		modalResult: '',
		func: null,
		onclose: true,
		hasCloseButton:true,
		minWidth:'500px',
		modal: true,
		data:null,
		cancelCaption:"Annuler",
		results:new Array(),
			
		waitFor: function(mr,func){
			this.results[mr]=func;
		},
		submit: function(mr){
			var result=false;
			var func=this.results[mr];
			this.modalResult=mr;
			if(func!=undefined){
				if (func!=null) {
					if(func.constructor === Array){
						for(var i=0;i<func.length;i++){
							try{ result=result || func[i](this);} catch(e){alert(e);}
						}
					}else{
						try{ result=result || func(this);} catch(e){}
					}
				}
			}
			this.onclose=result;

			if(this.onclose)
				this.hide();
		},
		tryToClose:function(){
			if(this.results[this.cancelCaption]!=undefined){
				try{
					this.results[this.cancelCaption](this);
				}
				catch(ex){}
			}
		},
		addCloseButton:function(){
			if($(this.id+"-closeButton")==null){
				var divClose=document.createElement("div");
				divClose.title="Fermeture de la boîte de dialogue";
				divClose.id=this.id+"-closeButton";
				divClose.className="closeButton";
				$(this.id).appendChild(divClose);
				var self=this;
				Forms.Utils.addEventToElement(divClose, "click", function(){self.tryToClose();self.hide();}, false);
			}
		},
		innerAddButton: function(id,caption,keycode,glyphIcon){
			var myId=caption.replace(/\W/g,"_");
			if(!id)
				id=this.id+'-'+myId+'-boxBtn';
			var btn=$(id);
			if(btn==null){
				btn=document.createElement("a");
				btn.id=id;
				$(this.id+"-boxButtons").appendChild(btn);
			}
			var me=this;
			var myfunction=function(){
				me.submit(caption);
			};
			if(glyphIcon!=undefined)
				this.setButtonContent(btn, caption, glyphIcon);
			else
				this.setButtonContent(btn, caption);
			btn.className="btn";
			btn.onclick=myfunction;
			if(keycode!=undefined)
				keyCodes[eval(keycode)]=myfunction;	
		},
		setButtonContent: function(btn,caption,glyphIcon){
			var content=caption;
			if(glyphIcon)
				content="<span class='glyphicon glyphicon-"+glyphIcon+"' aria-hidden='true'></span>&nbsp;"+content;
			Forms.Utils.setInnerHTML(btn, content);
		},
		addActions:function(actions){
			if(typeof(actions)=='string'){
				try{
					actions=JSON.parse(actions);
				}catch(ex){}
			}
			if(typeof(actions)=='object')
			for(var a in actions){
				this.addAction(actions[a].id,actions[a].caption,actions[a].action,actions[a].keycode,actions[a].glyphIcon);
			}
		},
		addAction:function(id,caption,action,keyCode,glyphIcon){
			this.innerAddButton(id,caption,keyCode,glyphIcon);
			this.waitFor(caption,action);
		},
		deleteAction:function(action){
			delete this.results[action];
			var element=$(this.id+"."+action+"-boxBtn");
			if(element!=null){
				$(this.id+"-boxButtons").removeChild(element);
			}
		},
		clearActions:function(){
			for(var actKey in this.results)
				this.deleteAction(this.results[actKey]);
			this.results=new Array();
		},
		setBtnCaption:function(btn,newCaption,glyphIcon){
			var element=$(this.id+"."+btn+"-boxBtn");
			if(element!=null){
				if(glyphIccon)
					this.setButtonContent(element, newCaption, glyphIcon);
				else
					this.setButtonContent(element, newCaption);
			}
		},
		onkeydown:function(e){
			var keycode=null;
			if (window.event) keycode = window.event.keyCode;
				else if (e) keycode = e.which;
			if(keyCodes[keycode]!=undefined){
				void(0);
				keyCodes[keycode](this);
				return false;
			}
		},
		hide: function(){
			try{
				document.onkeydown=null;
				//keyCodes=new Array();
				if(this.modal)
					$('filter').style.display='none';
				Forms.Utils.show(this.id, false);
				//$(this.id).style.display='none';
			}
			catch(ex){}
		},
		show: function(){
			try{
				//if($(this.id+'-box')==null)
				this.setAllContent();
				document.onkeydown=this.onkeydown;
				if(this.modal)
					$('filter').style.display='block';
				else
					$('filter').style.display='none';
				Forms.Utils.show(this.id, true);
				//$(this.id).style.display='table';
			}
			catch(ex){}
		},
		showHide:function(){
			if(this.isVisible())
				this.hide();
			else
				this.show();
		},
		isVisible:function(){
			var el=$(this.id);
			var style = el.currentStyle || window.getComputedStyle(el);
			return style.display!='none';
		},
		showModal:function(){
			this.modal=true;
			this.show();
		},
		createStructure:function(){
			if($('filter')==null){
				var filter=document.createElement("div");
				filter.style.display='none';
				filter.id='filter';
				document.body.appendChild(filter);
			}else
				filter=$('filter');
			if($(this.id)==null){
				box=document.createElement("div");
				document.body.appendChild(box);
				box.id=this.id;
				box.className='box';
				box.oldDisplay="table";
				box.innerHTML="<div id='"+this.id+"-boxheader' class='boxheader'>\n"
				+"		<div id='"+this.id+"-boxTitle' class='boxTitle'>"+this.title+"</div>\n"
				+"	</div>\n"
				+"	<div id='"+this.id+"-boxContent' class='boxContent'>"+this.content+"</div>\n"
				+"	<div id='"+this.id+"-boxButtons' class='boxButtons'></div>\n";
				title=$(this.id+"-boxTitle");
				$(this.id+"-boxContent").lb=this;
				Forms.Utils.addDragByTitle(title, box);
				if(this.hasCloseButton)
					this.addCloseButton();
			}				
		},
		setAllContent:function(){
			this.setContent(this.content);
		},
		setContent: function(content){
			this.content=content;
			this.createStructure();
			$(this.id+"-boxTitle").innerHTML=this.title;
			Forms.Utils.setInnerHTML($(this.id+"-boxContent"), content);
		},
		setTitle:function(title){
			this.title=title;
			if($(this.id+"-boxTitle")!=null)
				$(this.id+"-boxTitle").innerHTML=title;
		}
	};
	var self = Forms.LightBox;
})();
(function(){
	var vendors=['-moz-','-webkit-','-o-','-ms-','-khtml-',''];

	Forms.Css3={
			toCamelCase:function(str){
				return str.toLowerCase().replace(/(\-[a-z])/g, function($1){ return $1.toUpperCase().replace('-','');});
			},
			setCss3Style:function(el,prop,val){
			    for(var i=0,l=vendors.length;i<l;i++)
			        {
			            var p = Forms.Css3.toCamelCase(vendors[i] + prop);
			            if(p in el.style)
			                el.style[p] = val;
			        }
			},
			getCss3Style:function(el,prop){
				var style=window.getComputedStyle(el, null);
			    for(var i=0,l=vendors.length;i<l;i++)
			        {
			            var p = Forms.Css3.toCamelCase(vendors[i] + prop);
			            if(p in style)
			                return style[p];
			        }
			},
			getCss3StyleVendorName:function(el,prop){
				var style=window.getComputedStyle(el, null);
			    for(var i=0,l=vendors.length;i<l;i++)
			        {
			            var p = Forms.Css3.toCamelCase(vendors[i] + prop);
			            if(p in style)
			                return vendors[i] + prop;
			        }
			},
			defineTransitions:function(el,transitions,force){
				if(force==undefined)
					force=true;
				var applyProperty=function(value){
					for(var i=0;i<transitions.length;i++){
						if(transitions[i]["property"]){
							if(transitions[i][value]!=undefined)
								Forms.Css3.setCss3Style(el, transitions[i]["property"], transitions[i][value]);
						}
					}
				};
				if(transitions && el){
					if(transitions.constructor === Array){
						var allTransitions=new Array();
						for(var i=0;i<transitions.length;i++){
							allTransitions.push(Forms.Css3.getCss3StyleVendorName(el,transitions[i]["property"])+" "+transitions[i]["duration"]);
							if(transitions[i]["_endValue"]==undefined)
								transitions[i]["_endValue"]=Forms.Css3.getCss3Style(el, transitions[i]["property"]);
						}
						allTransitions=allTransitions.join(",");
						if(force){
							Forms.Css3.setCss3Style(el, "transition", "");
							applyProperty("startValue");
							Forms.Css3.defineTransitions(el, transitions, false);
						}else{
							for(var i in transitions){
								var actual=Forms.Css3.getCss3Style(el, transitions[i]["property"]);
								if(actual==transitions[i]["startValue"])
									transitions[i]["finalValue"]=transitions[i]["endValue"];
								else if(actual==transitions[i]["endValue"])
									transitions[i]["finalValue"]=transitions[i]["startValue"];
								else
									transitions[i]["finalValue"]=transitions[i]["endValue"];
								if(transitions[i]["finalValue"]==undefined)
									transitions[i]["finalValue"]=transitions[i]["_endValue"] || transitions[i]["_startValue"];
							}
							Forms.Css3.setCss3Style(el, "transition", allTransitions);
							applyProperty("finalValue");
						}
					}else{
						Forms.Css3.defineOneTransition(el, transitions["property"], transitions["startValue"], transitions["endValue"], transitions["duration"], force);
					} 
				}
			},
			defineOneTransition:function(el,property,value1,value2,duration,force){
				var propertyVendor=Forms.Css3.getCss3StyleVendorName(el,property);
				if(force){
					Forms.Css3.setCss3Style(el, "transition", "");
					Forms.Css3.setCss3Style(el, property, value1);
					Forms.Css3.defineOneTransition(el, property, value1, value2, duration, false);
				}else{
					var actual=Forms.Css3.getCss3Style(el, property);
					if(actual==value1){
						Forms.Css3.setCss3Style(el, "transition", propertyVendor+" "+duration);
						Forms.Css3.setCss3Style(el, property, value2);
					}else if(actual==value2){
						Forms.Css3.setCss3Style(el, "transition", propertyVendor+" "+duration);
						Forms.Css3.setCss3Style(el,property,value1);
					}else{
						Forms.Css3.setCss3Style(el, property, value1);
						Forms.Css3.setCss3Style(el, "transition", propertyVendor+" "+duration);
						Forms.Css3.setCss3Style(el, property, value2);
					}
				}
				
			}
	};
	var self = Forms.Css3;
})();
(function(){
	Forms.DOM={
		noChildren : {input: true,meta: true,br: true,link: true,img: true,select: true}
		,
		canHaveChildren:function (tagName) {
				if(!tagName)
					return false;
			    tagName = tagName.toLowerCase();
			    return (Forms.DOM.noChildren[tagName] === undefined);
		},
		getPossibleParent:function(parentElement){
			if(Forms.DOM.canHaveChildren(parentElement.tagName))
				return parentElement;
			else{
				parentElement=parentElement.parentNode;
				if(!parentElement || parentElement==document.body)
					return document.body;
				else
					return Forms.DOM.getPossibleParent(parentElement);
			}
					
		},
		getNextsibling:function(node){
			var x=node.nextSibling;
			while (x.nodeType!=1){
				x=x.nextSibling;
			}
			return x;
		},
		getTargetEvent:function(e){
			return e.currentTarget || e.target || e.srcElement || e.originalTarget || e;
		},
		getKeyCode:function(e){
			var keycode=null;
			if (window.event) keycode = window.event.keyCode;
				else if (e) keycode = e.which;
			return keycode;
		},
		move:function(elementToMove,toElement){
			if(Object.isString(elementToMove))
				elementToMove=$(elementToMove);
			if(Object.isString(toElement))
				toElement=$(toElement);
			if(elementToMove && toElement){
				elementToMove.parentNode.removeChild(elementToMove);
				toElement=Forms.DOM.getPossibleParent(toElement);
				toElement.appendChild(elementToMove);
			}
		},
		remove:function(element){
			if(Object.isString(element))
				element=$(element);
			if(element!=null){
				if(element.parentNode){
					element.parentNode.removeChild(element);
				}
			}
		},
		createElement:function(type){
			if(type==undefined)
 				type="div";
			return document.createElement(type);
		},
		insertAfter:function(idToInsert,targetElement,type){
			var elm=null;
			if($(idToInsert)==undefined){
				elm=Forms.DOM.createElement(type);
				elm.id=idToInsert;
				if(targetElement!=undefined){
					Forms.Utils.insertAfter(elm, targetElement);
				}
 			}
 			return elm;
		},
		insertIn:function(idToInsert,targetElement,type){
			var elm=null;
			if($(idToInsert)==undefined && targetElement){
				if(!targetElement.tagName || Forms.DOM.canHaveChildren(targetElement.tagName)){
					if(targetElement==document)
						targetElement=document.body;
					elm=Forms.DOM.createElement(type);
					elm.id=idToInsert;
					if(targetElement){
						targetElement.appendChild(elm);
					}
				}else
					elm=Forms.DOM.insertAfter(idToInsert, targetElement, type);
 			}
			return elm;
		},
		insertBefore:function(idToInsert,targetElement,type){
 			if($(idToInsert)==undefined){
				var elm=Forms.DOM.createElement(type);
				elm.id=idToInsert;
				if(targetElement!=undefined){
					Forms.Utils.insertBefore(elm, targetElement);
				}
 			}
		},
		replaceElement:function(idNewElement,targetElement,type,copy){
			if(!idNewElement)
				idNewElement=Forms.Framework.getRandomUID();
			if($(idNewElement)==undefined){
				if(!targetElement.id)
					targetElement.id=Forms.Framework.getRandomUID();
				var newElement=Forms.DOM.insertIn(idNewElement, targetElement.parentNode, type);
				newElement.replacedElement=targetElement;
				Forms.DOM.remove(targetElement);
				if(copy)
					Forms.Utils.setInnerHTML(newElement, $$(targetElement));
				newElement.focus();
				return newElement;
			}
		},
		restoreReplacedElement:function(element,copy){
			if(typeof element == "string")
				element=$(element);
			if(element!=undefined){
				if(element.replacedElement){
					element.parentNode.appendChild(element.replacedElement);
					if(copy)
						Forms.Utils.setInnerHTML(element.replacedElement, $$(element));
					Forms.DOM.remove(element);
				}
			}
			return element.replacedElement;
		},
		addScript:function(src){
			var js = document.createElement('script');
			js.src =src;
			var first = document.getElementsByTagName('script')[0];
			if(first)
				first.parentNode.insertBefore(js, first);
		},
		createTableFromAssoArray:function(container,items,functions){
			var getValue=function(element,index,value){
				if(functions && (functions instanceof Array)){
					if(index<functions.length){
						return functions[index](element,value);
					}
				}
				return element.appendChild(document.createTextNode(value));
			};
			var tbl=document.createElement('table');

			var tbdy=document.createElement('tbody');
			for(var key in items){
			    var tr=document.createElement('tr');
			    var td1=document.createElement('td');
			    getValue(td1,0,key);
			    tr.appendChild(td1);
			    var td2=document.createElement('td');
			    getValue(td2,1,items[key]);
			    tr.appendChild(td2);
			    tbdy.appendChild(tr);
			}
			tbl.appendChild(tbdy);
			container.appendChild(tbl);
		},
		bind:function(selector,event,func){
			(new Forms.Elements(selector)).addEvent(event, func);
		},
		bindReady:function(handler){

			var called = false;
			var ready=function () { 
				if (called) return;
				called = true;
				handler();
			};

			if ( document.addEventListener ) {
				document.addEventListener( "DOMContentLoaded", ready, false);
			} else if ( document.attachEvent ) {  // IE
				var isFrame=false;
				try {
						isFrame = window.frameElement != null;
				} catch(e) {}
				if ( document.documentElement.doScroll && !isFrame ) {
					function tryScroll(){
						if (called) return
						try {
							document.documentElement.doScroll("left");
							ready();
						} catch(e) {setTimeout(tryScroll, 10);}
					}
					tryScroll();
				}

				// IE, the document is inside a frame
				document.attachEvent("onreadystatechange", function(){
					if ( document.readyState === "complete" ) {
						ready();
					}
				});
			}
			// Old browsers
		    if (window.addEventListener)
		        window.addEventListener('load', ready, false);
		    else if (window.attachEvent)
		        window.attachEvent('onload', ready);
		    else {
				var fn = window.onload;
				window.onload = function() {
					fn && fn();
					ready();
				};
		    }
		},
		onReady:function(handler) {
			if(!(document.readyList instanceof Array))
					document.readyList=new Array();
			function executeHandlers() {
				var i=0;
				var nb=document.readyList.length;
				while(i<nb){
					try{document.readyList[0]();} catch(e){}
					document.readyList.splice( 0, 1 );
					i++;
				}
//				for(var i=0; i<document.readyList.length; i++) {
//					document.readyList[i]();
//				}
			}

			if (!document.readyList.length) { // set handler on first run 
				Forms.DOM.bindReady(executeHandlers);
			}
			document.readyList.push(handler);
		},
		isMouseOut:function(e,src){
			if (!e) e = window.event;
			var tg = (window.event) ? e.srcElement : e.target;
			if (!tg || tg.id!= src.id) return false;
			var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
			while (reltg!=null && reltg != tg && reltg.nodeName != 'BODY')
				reltg= reltg.parentNode;
			if (reltg== tg) return false;
			return true;
		},
		isVisible:function(element){
			var style = element.currentStyle || window.getComputedStyle(element);
			return style.display!='none' && style.visibility!='hidden';
		},
		isReallyVisible:function(element){
			if(!Forms.DOM.isVisible(element))
				return false;
			else{
				if(!element.parentNode)
					return false;
				else if (element.parentNode!=document.body)
					return Forms.DOM.isReallyVisible(element.parentNode);
			}
			return true;
		},
		hasFocus:function(element){
			if(document.activeElement==element)
				return true;
			var children=element.childNodes;
			if(children){
				for(var i=0;i<children.length;i++){
					var result=Forms.DOM.hasFocus(children[i]);
					if(result==true)
						return true;
				}
			}
			return false;
		},
		matchText:function(node, regex, callback, excludeElements) { 

		    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
		    var child = node.firstChild;
		    if(child){
			    do {
			        switch (child.nodeType) {
			        case 1:
			            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1) {
			                continue;
			            }
			            Forms.DOM.matchText(child, regex, callback, excludeElements);
			            break;
			        case 3:
			           child.data.replace(regex, function(all) {
			                var args = [].slice.call(arguments),
			                    offset = args[args.length - 2],
			                    newTextNode = child.splitText(offset);
	
			                newTextNode.data = newTextNode.data.substr(all.length);
			                callback.apply(window, [child].concat(args));
			                child = newTextNode;
			            });
			            break;
			        }
			    } while (child = child.nextSibling);
		    }
		    return node;
		},
		getMaxZIndex:function(selector){
			max=10;
			new Forms.Elements(selector).each(function(k,v){
				vz=parseInt(v.style.zIndex);
				if(v.style.zIndex>max){
					max=vz;
				}
			});
			return max;
		},
		addOptionToSelect:function(text,value,selectElement){
			var option=document.createElement("option");
			option.text=Forms.Utils.unescapeHTML(text);
			option.value=value;
			try{
				selectElement.add(option,selectElement.options[null]);
			}catch (e) {selectElement.add(option,null);}
			  return option;
		},
		hasClass:function(element, cssClass) {
		    return element.className && new RegExp("(^|\\s)" + cssClass + "(\\s|$)").test(element.className);
		},
		getOpacity : function(target){
		    if(!Forms.Utils.isIE()){
		        var temp_style = document.defaultView.getComputedStyle(target,null); 
		        if (!isNaN(temp_style.opacity)) { 
		            opacityVal = temp_style.opacity; 
		        } else if (!isNaN(temp_style.MozOpacity)) { 
		            opacityVal = temp_style.MozOpacity; 
		        } else {
		            opacityVal = 1;
		        }
		        return parseFloat(opacityVal*100);
		    } else {
		        try {
		            return target.filters.item('DXImageTransform.Microsoft.Alpha').Opacity;
		        } catch(e) {
		            return 100;
		        }
		    } 
		},
		setOpacity:function(target,value){
			if(!Forms.Utils.isIE())
				target.style.opacity = value/100;
			else
				target.style.filter = "alpha(opacity="+value+")";
		},
		JSONToDomElements:function(obj){
			for(var id in obj){
				if($(id)){
					var element=$(id);
					if(element){
						var value=Forms.Utils.unescapeHTML(decodeURIComponent(obj[id]));
						if(element.value!=undefined){
							element.value=value;
							if(element.type=="hidden" && $("_"+id)!=undefined){//Checkbox ou radio
								element=$("_"+id);
								if(element.type=="checkbox" || element.type=="radio")
									element.checked=(value=="1" || value=="true");
							}
							Forms.Utils.fireEvent(element, "change");
						}
						else
							Forms.Utils.setInnerHTML(id, value);
					}
				}
			}
		}
	};
}());

(function(){
	Forms.KObject={
		refreshContent: function(idElement){
			if(idElement==undefined) idElement='ajxContent';
			element=$(idElement);
			if(element!=undefined){
				var script_name = window.location.href;
				var filename = script_name.replace(/^.*(\\|\/)/, '');
				var pathname = script_name.replace(filename, '');
				ajx=new Forms.Ajax(idElement,pathname+'ajx'+filename);
				ajx.get();
			}
		}
	};
	
	var self = Forms.KObject;
})();
(function(){
	Forms.CssAccordion=function(containerId,type,pages,parent,selectedIndex,options){
		this.containerId=containerId;
		if(parent){
			this.parent=$(parent);
		}
		else
			this.parent=document.body;
		if(type)
			this.type=type;
		this.selectedIndex=selectedIndex;
		if(pages)
			this.pages=pages;
		if(options){
			for(var option in options){
				this[option]=options[option];
			}
		}
		this.initPages();
		return this;
	};
	Forms.CssAccordion.prototype={
		containerId:'',
		parent: null,
		type: 'radio',
		allowSelectNone:true,
		pages:new Array(),
		selectedIndex:-1,
		transition:"height 0.3s ease-in-out, box-shadow 0.6s linear",
		initPages:function(){
			if(!$(this.containerId)){
				var container=Forms.DOM.insertIn(this.containerId, this.parent, "section");
				container.className="ac-container";
			}
			if(this.pages && this.pages.constructor === Array){
				for(var i=0;i<this.pages.length;i++){
					this.createOnPage(i);
				}
			}
		},
		createOnPage:function(index){
			var container=$(this.containerId);
			var selectedRadio=null;
			if(this.selectedIndex-1==index)
				selectedRadio=index;
			var deselect=function(e){
				e=Forms.DOM.getTargetEvent(e);
				if(e.checked && getCheckedValue(document.getElementsByName(e.name))==selectedRadio){
					e.checked=false;
					selectedRadio=null;
				}else
					selectedRadio=e.value;
			};
			if(container){
				if(!$(this.containerId+"-div-"+index)){
					var containerDiv=Forms.DOM.insertIn(this.containerId+"-div-"+index, container, "div");
					var bt=Forms.DOM.insertIn(this.containerId+"-bt-"+index, containerDiv, "input");
					bt.type=this.type;
					bt.name=this.containerId+"-bt";
					bt.value=index;
					if(this.allowSelectNone)
						Forms.Utils.addEventToElement(bt, "click", deselect);
					if(index+1==this.selectedIndex)
						bt.checked=true;
					bt.className="acBt";
					var lbl=Forms.DOM.insertIn(this.containerId+"-lbl-"+index, containerDiv, "label");
					lbl.htmlFor=bt.id;
					lbl.textContent=this.pages[index];
					lbl.className="acLabel";
					var article=Forms.DOM.insertIn(this.containerId+"-article-"+index, containerDiv, "article");
					article.className="ac-large";
					if(this.transition)
						Forms.Css3.setCss3Style(article, "transition", this.transition);
				}
			}
		}
	};
})();
(function(){
	Forms.Selector=function(selector,event,allowNull,startIndex,functionName,selectedStyle,keyCode){
		if(allowNull!==undefined)
			this.allowNull=allowNull;
		if(functionName!==undefined)
			this.functionName=functionName;
		if(selectedStyle!==undefined)
			this.selectedStyle=selectedStyle;
		this.selector=selector;
		if(event!==undefined)
			this.event=event;
		if(startIndex!==undefined)
			this.startIndex=startIndex;
		if(keyCode!==undefined)
			this.defaultBtnKeyCode=keyCode;
		this.attach();
		return this;
	};
	Forms.Selector.prototype={
		functionName:null,
		allowNull:false,
		event:"click",
		parentTagName:"table",
		startIndex:1,
		defaultBtnKeyCode:-1,
		selectedStyle:{"backgroundColor":"#3D7493","color":"white"},
		selector:"",
		parent:null,
		elements:null,
		addEvents:function(objects){
			var self=this;
			var func=function(e){
				var target=$gte(e);
				if(self.functionName.constructor === Array){
					for(var i=0;i<self.functionName.length;i++){
						try{self.functionName[i](target);} catch(e){alert(e);}
					}
				}else{
					try{self.functionName(target);} catch(e){alert(e);}
				}
			};
			if(this.event.indexOf("key")==0){
				Forms.Framework.addEditableFields();
				var clearSelection=function() {
					var cont=true;
					if(document.activeElement)
						cont=document.activeElement.tagName.toLowerCase()!="input";
					if(cont){
					    if(document.selection && document.selection.empty) {
					        document.selection.empty();
					    } else if(window.getSelection) {
					        var sel = window.getSelection();
					        sel.removeAllRanges();
					    }
					}
				};
				/*var makeUnselectable=function(elem) {
					  if (typeof(elem) == 'string')
					    elem = $(elem);
					  if (elem) {
					    elem.onselectstart = function() { return false; };
					    elem.style.MozUserSelect = "none";
					    elem.style.KhtmlUserSelect = "none";
					    elem.unselectable = "on";
					  }
					};*/
				this.elements.each(function(k,v){
					//makeUnselectable(v);
					Forms.Utils.addEventToElement(v, "dblclick", function(e){
						self.select(v);
						self.elements.selectById(v.id);
						clearSelection();
					});
				});
				var keyUpFunction=function(e){
					var cont=true;
					if(document.activeElement)
						cont=document.activeElement.tagName.toLowerCase()!="input";
					if(cont){
						var keycode=null;
						if (window.event) keycode = window.event.keyCode;
							else if (e) keycode = e.which;
						switch (keycode) {
						case 40: case 39:
							self.selectNext();
							break;
							
						case 38: case 37:
							self.selectPrevious();
							break;
							
						case self.defaultBtnKeyCode:
							self.fireDefaultBtn();
							break;
							
						case 107:
							self.fireToogle(true);
							break;
							
						case 109:
							self.fireToogle(false);
							break;
							
						default:
							break;
						}
						//void(0);
						//return false;
					}
				};
				if(objects.length>0){
					this.parent=Forms.Utils.getParent(objects[0],this.parentTagName);
					this.parent.selector=this;
					this.parent.tabIndex="1";
				}
				Forms.Utils.addUniqueEvent(this.parent, this.event, keyUpFunction, true,undefined,true);
			}else{
				for ( var i = this.startIndex; i < objects.length; i++ ) {
					objects[i].selectorIndex=i;
					Forms.Utils.addEventToElement(objects[i],this.event,function(){self.select(this);},false);
					if(this.functionName!=null)
						Forms.Utils.addEventToElement(objects[i],this.event,func,false);
				}
			}
		},
		fireDefaultBtn:function(){
			var element=$(this.elements.selectedItem);
			if(element){
				(new Forms.Elements(".default",element)).each(function(k,v){Forms.Utils.fireEvent(v, "click");});
			}
		},
		fireToogle:function(sens){
			var element=$(this.elements.selectedItem);
			if(element){
				(new Forms.Elements(".toogleable",element)).each(function(k,v){
					if(sens && !v.toogled)
						Forms.Utils.fireEvent(v, "click");
					else if(!sens && v.toogled)
						Forms.Utils.fireEvent(v, "click");
					});
			}
		},
		attach:function(){
			this.elements=new Forms.Elements(this.selector);
			this.elements.selectedItem=-1;
			this.addEvents(this.elements.values);
		},
		getSelected:function(){
			return this.elements.selectedItem;
		},
		setSelected:function(id){
			if(this.parent){
				if(id!=this.elements.selectedItem){
					var item=$(id);
					var value=-1;
					if(this.parent.tagName.toLowerCase()=="table"){
						value=$$("id-"+id);
					}
					Forms.Utils.dispatchCustomEvent(this.parent.id, "itemchanged", {"item":item,"value":value});
				}
			}
			this.elements.selectedItem=id;
		},
		dispatchEvent:function(id){
			var result=true;
			if(this.parent && window.CustomEvent){
				var event = new CustomEvent('itemchange');
				var item=$(id);
				var value=-1;
				if(this.parent.tagName.toLowerCase()=="table"){
					value=$$("id-"+id);
				}
				event.initCustomEvent("itemchange", true, true, {"item":item,"value":value});
				result=this.parent.dispatchEvent(event);
			}
			return result;
		},
		select:function(element){
			if(element){
				if(this.elements.selectedItem!=element.id){
					var cont=this.dispatchEvent(element.id);
					if(cont){
						Forms.Utils.setStyles(element,this.selectedStyle);
						selected=this.getSelected();
						if(selected!=-1&&(selected!==element.id||this.allowNull)){
							Forms.Utils.dispatchCustomEvent(this.parent.id, "beforeitemchange", {"item":$(selected),"value":$$("id-"+selected)});
							this.clearStyles($(selected));
						}
						if(selected===element.id&&this.allowNull)
							this.setSelected(undefined);
						else
							this.setSelected(element.id);
					}
				}
			}
		},
		getValue:function(){
			if(this.elements.selectedItem){
				var elm=$("id-"+this.elements.selectedItem);
				if(elm && elm.value)
					return elm.value;
			}
		},
		getSelectedElement:function(){
			return $(this.elements.selectedItem);
		},
		selectPrevious:function(){
			this.select(this.elements.previous());
		},
		selectNext:function(){
			this.select(this.elements.next());
		},
		clearStyles:function (element){
			if(element){
			    for(var s in this.selectedStyle) {
			        try{element.style[s] = "";}
			        catch(e){}
			    }
			}
		}
	};
})();
(function(){
	Forms.Accordion=function(element,speed,refresh){
		if(element){
			this.element=element;
			if(refresh!=undefined) this.refresh=refresh;
			if(speed!=undefined) this.speed=speed;
			this.element.style.display='block';
			this.maxh =this.height(this.element);
		}
		return this;
	};
	Forms.Accordion.prototype={
		titleElement:null,
		element:null,
		speed:5,
		refresh:10,
		maxh:'60',
		timer:null,
		display:function(element,value){
			if(value==undefined){
				return element.style.display;
			}else{
				element.style.display=value;
			}
		},
		height:function(element,value){
			if(value==undefined){
				if(this.display(element)!='none'&& this.display(element)!=''){
					return element.clientHeight;
				}
				viz = element.style.visibility;
				element.style.visibility = 'hidden';
				o = this.display(element);
				this.display(element,'block');
				this.element.style.height='auto';
				r = parseInt(element.clientHeight);
				this.display(element,o);
				element.style.visibility = viz;
				return r;
			}else{
				element.style.height=value;
			}
		},
		collapseTimer:function(d){
			if(this.height(d)>0){
				var v = Math.round(this.height(d)/this.speed);
				if(v<1) {v=1;}
				v = (this.height(d)-v);
				this.height(d,v+'px');
				d.style.opacity = (v/this.maxh);
				if(d.style.filter){
					d.style.filter= 'alpha(opacity='+(v*100/this.maxh)+');';}
			}else{
				this.height(d,0);
				this.display(d,'none');
				clearInterval(this.timer);
			}
		},
		expandTimer:function(d){
			if(this.height(d)<this.maxh){
				var v = Math.round((this.maxh-this.height(d))/this.speed);
				if(v<1) {v=1;}
				v = (this.height(d)+v);
				this.height(d,v+'px');
				d.style.opacity = (v/this.maxh);
				if(d.style.filter){
					d.style.filter= 'alpha(opacity='+(v*100/this.maxh)+');';}
			}else{
				this.height(d,this.maxh);
				clearInterval(this.timer);
			}
		},
		collapse:function(){
			var d=this.element;
			var self=this;
			if(this.display(d)=='block'){
				clearInterval(this.timer);
				this.timer=setInterval(function(){self.collapseTimer(d);},this.refresh);
			}
		},
		expand: function(){
			var d=this.element;
			this.maxh =this.height(this.element);
			var self=this;
			if(this.display(d)=='none'){
				this.display(d,'block');
				d.style.height='0px';
				clearInterval(this.timer);
				this.timer=setInterval(function(){self.expandTimer(d);},this.refresh);
			}
		},
		attach:function(titleElement){
			var self=this;
			if(titleElement!=undefined){
				this.titleElement=titleElement;
				Forms.Utils.addEventToElement(titleElement, "click", function(){self.click();});
			}
		},
		click:function(){
			var d=this.element;
			if(this.display(d)=='none')
				this.expand();
			else
				this.collapse();
		}
			
	};
})();
(function(){
	var updateItems=function(e,ckList){
		var element=Forms.DOM.getTargetEvent(e);
		var ckId=ckList.getElementId();
		if(element && element.value){
			var values=element.split(";");
			for(var i=0;i<values.length;i++){
				Forms.Utils.click($(ckId+values[i]));
			}
		}
		
	};
	/*var nEvt;
	if(document.createEvent)
		nEvt=document.createEvent('listcomplete');
	else
		nEvt= new Event('listcomplete');*/
	Forms.List=function(id,allowSelectNone){
		this.id=id;
		if(allowSelectNone!=undefined)
			this.allowSelectNone=allowSelectNone;
		this.init();
	};
	Forms.List.prototype={
		id:"",
		height:"70px",
		searchElement:null,
		allowSelectNone:true,
		ckListAjax:null,
		ckListAjaxLoader:null,
		ckList:null,
		ckListInner:null,
		ckListInfo:null,
		originalValue:"",
		timer:null,
		accordion:null,
		change:false,
		itemName:"item",
		init:function(){
			var self=this;
			if(this.searchElement==null){
				this.searchElement=$("ckListSearchText-"+this.id);
			}
			if(this.searchElement!=undefined){
				this.searchElement.ckList=this;
				Forms.Utils.addEventToElement(this.searchElement, "keyup", function(){self.searchFor();});
				Forms.Utils.addEventToElement(this.searchElement, "click", function(event){event.cancelBubble=true;if (event.stopPropagation) event.stopPropagation();});
			}
			this.ckListAjax=$("ckList-ajax-"+this.id);
			this.ckListAjaxLoader=$("ckList-ajax-loader-"+this.id);
			this.ckList=$("ckList-"+this.id);
			this.ckListInner=$("ckList-inner-"+this.id);
			this.ckListInfo=$("ckListInfo-"+this.id);
			this.originalValue=$$(this.id);
			$(this.id).ckList=this;
			$(this.id).eventClick=function(){self.show();};
			var elm=$(this.id);
			Forms.Utils.addEventToElement($(this.id),"change",function(){
				if(!elm.ckList.change){
					elm.ckList.deselectAll();
					var ckId=elm.ckList.getElementId();
					if(elm && elm.value){
						var values=elm.value.split(";");
						for(var i=0;i<values.length;i++){
							if(values[i]!=""){
								elm.ckList.selectItem($(ckId+values[i]));
								Forms.Utils.show(ckId+values[i], true);
							}
						}
					}
					elm.ckList.updateInfo();
				}
			});
			Forms.Utils.addEventToElement($("ckListCaption-"+this.id), "click", $(this.id).eventClick);
			this.accordion=new Forms.Accordion(this.ckListInner, 5, 24);
		},
		deselectItem:function(item){
				Forms.Utils.replaceClass(this.itemName+"-selected",this.itemName, item);
		},
		selectItem:function(item){
			Forms.Utils.replaceClass(this.itemName,this.itemName+"-selected", item);

		},
		deselectAll:function(){
			var self=this;
			(new Forms.Elements("#ckList-"+this.id+" ."+this.itemName+"-selected")).each(function(k,v){self.deselectItem(v);});
		},
		isSelected:function(element){
			return element.className.indexOf("selected")!=-1;
		},
		setValue:function(newValue){
			this.noChange=true;
			$(this.id).value=newValue;
			this.noChange=false;
		},
		limitSizeTo:function(height){
			this.height=height;
			Forms.Utils.removeEventFromElement($("ckListCaption-"+this.id), "click", $(this.id).eventClick);
			this.toogle();
		},
		show:function(ckElement){
			var visible=this.ckListInner.style.display!="none";
			if(!visible)
				this.accordion.expand();
			else
				this.accordion.collapse();
			this.stopTimer();
		},
		runTimer:function(){
			var visible=this.ckListInner.style.display!="none";
			if(!visible && this.timer==null){
				var sel=this;
				var showUpdateInList=function(){
					if(visible)
						sel.stopTimer();
					else{
						var caption=$("ckListCaption-"+sel.id);
						caption.style.fontWeight=(caption.style.fontWeight=='bold')?'normal':'bold';
					}
				};
				this.timer=setInterval(showUpdateInList, 1000);
			}
		},
		stopTimer:function(){
			var visible=this.ckListInner.style.display!="none";
			if(visible && this.timer!=null){
				clearInterval(this.timer);
				this.timer=null;
				$("ckListCaption-"+this.id).style.fontWeight='normal';
			}
		},
		toogle:function(ckElement){
			var allVisible=this.ckListInner.style.overflow!="auto";
			if(!allVisible){
				Forms.Utils.show(this.ckListInner.id, true);
				this.ckListInner.style.overflow="hidden";
				this.height=this.ckListInner.style.height;
				this.ckListInner.style.height="auto";
			}else{
				this.ckListInner.style.overflow="auto";
				this.ckListInner.style.maxHeight=this.height;
			}
			this.stopTimer();
		},
		getElements:function(){
			var elements;
			elements=this.ckList.getElementsByTagName("div");
			elements=Array.prototype.slice.call(elements);
			if(this.ckListAjax!=null){
				elements=elements.concat(Array.prototype.slice.call(this.ckListAjax.getElementsByTagName("div")));
			}
			return elements;
		},
		getCount:function(){
			var elements=this.getElements();
			var result=0;
			for(var i=0;i<elements.length;i++){
				if(Forms.DOM.isVisible(elements[i]))
					result++;
			}
			return result;
		},
		getElementId:function(){
			return this.itemName+"-"+this.id+"-";
		},
		getElementValue:function(element){
			return element.id.replace(this.itemName+"-"+this.id+"-","");
		},
		isElementInOriginalSelection:function(element){
			var eValue=this.getElementValue(element);
			return (";"+this.originalValue+";").indexOf(";"+eValue+";")!=-1;
		},
		searchFor:function(){
			var searchText="";
			var okToSearch=false;
			if(this.searchElement!=null){
				searchText=this.searchElement.value;
				if(searchText.length>1 || searchText=="")
					okToSearch=true;
			}
			var self=this;
			var searchFunction=function(){
				if(okToSearch){
						if(self.ckListAjax!=null)
							self.addSelect(self.ckListAjax.id);
						searchText=searchText.replace(new RegExp("([(.*)])","g"),"\\$1");
						var regExp=new RegExp("("+searchText+")","gi");
						var elements=self.getElements();
						for(var i=0;i<elements.length;i++){
							var innerText=Forms.Utils.innerText(elements[i]);
							if(regExp.test(innerText) || self.isSelected(elements[i])){
									elements[i].innerHTML=innerText.replace(regExp,"<span class='ckListFindedText'>$1<\/span>");
								Forms.Utils.show(elements[i].id, true);
								if(innerText==searchText){
									allowSelectNone=this.allowSelectNone;
									self.allowSelectNone=false;
									Forms.Utils.click(elements[i]);
									self.allowSelectNone=allowSelectNone;
								}
							}
							else{
								Forms.Utils.show(elements[i].id, (elements[i].parentNode==self.ckListAjax) || self.isElementInOriginalSelection(elements[i]));
								elements[i].innerHTML=innerText;
							}
						}
						if(elements.length>0)
							self.runTimer();
						if(self.ckListInner.style.overflow!="auto") self.ckListInner.style.height="auto";
					}
				Forms.Utils.fireEvent($(self.id), "listcomplete");
			};
			if(okToSearch){
				if(this.ckListAjax!=null){
					var params="_listMask="+$$("ckList-ajax-listMask-"+this.id)+"&_oValue="+this.originalValue+"&_cls="+$$("ckList-ajax-cls-"+this.id)+"&_clsList="+$$("ckList-ajax-clsList-"+this.id)+"&_field="+this.id+"&_value="+$$(this.id)+"&_search="+this.searchElement.value;
					var ajxRequest=new Forms.Ajax(this.ckListAjax.id, "d.KAjaxListContent", params, searchFunction, this.ckListAjaxLoader);
					ajxRequest.get();
				}else
					searchFunction();
			}
		}
	};
})();
(function(){
	Forms.CheckedList=function(id,allowSelectNone){
		Class.create(Forms.CheckedList, Forms.List);
		this.itemName="ckItem";
		Forms.List.call(this,id,allowSelectNone);
		var self=this;
		Forms.Utils.addEventToElement($("ckListCaption-checkall-"+this.id), "click", function(){self.checkAll();});
		this.addSelect("ckList-"+this.id);
	};
	Forms.CheckedList.prototype={
		allChecked:false,
		checkAll:function(){
			var elements=this.getElements();
			this.allChecked=!this.allChecked;
			for(var i=0;i<elements.length;i++){
				if(this.isSelected(elements[i])!=this.allChecked){
					Forms.Utils.click(elements[i]);
				}
			}
			if(!this.allChecked)
				this.setValue("");
		},
		getElementId:function(){
			return this.itemName+"-"+this.id+"-";
		},
		getSelSize:function(){
			var elements=this.getElements();
			var size=0;
			for(var i=0;i<elements.length;i++){
				if(this.isSelected(elements[i]))
					size++;
			}
			return size;
		},
		addSelect:function(containerId){
			this.change=true;
			var element=$(this.id);
			var sel=this;
			this.updateInfo();
			var onclick=function(){
				sel.change=true;
				var newValue=this.id.replace(sel.itemName+"-"+element.id+"-","");
				var value=element.value.replace(newValue,"");
				value=value.replace(/;;/g,";");
				if(sel.isSelected(this)){
					sel.deselectItem(this);
					sel.setValue(value);
				}else{
					sel.selectItem(this);
					sel.setValue(value+";"+newValue);
				}
				sel.updateInfo();
				sel.change=false;
			};
			Forms.Utils.addEvent(containerId, "div", "click", onclick, true);
			this.change=false;
		},
		updateInfo:function(){
			if(this.ckListInfo!=null){
				this.ckListInfo.innerHTML="("+this.getSelSize()+")";
			}
			if(this.change)
				Forms.Utils.fireEvent($(this.id), "change");
		}
	};
})();
(function(){
	Forms.RadioList=function(id,allowSelectNone){
		Class.create(Forms.RadioList, Forms.List);
		this.itemName="rItem";
		Forms.List.call(this,id,allowSelectNone);
		this.addSelect("ckList-"+this.id);
		if(this.allowSelectNone==false){
			elem=this.getElements()[0];
			if(elem!=null&&$$(this.id)==="")
				Forms.Utils.click(elem);
		}
	};
	Forms.RadioList.prototype={
		addSelect:function(containerId){
			var element=$(this.id);
			var self=this;
			this.updateInfo();
			var onclick=function(){
				self.change=true;
				var newValue=this.id.replace(self.itemName+"-"+element.id+"-","");
				var oldElementSelected=$(self.itemName+"-"+element.id+"-"+element.value);
				if(oldElementSelected!=null)
					self.deselectItem(oldElementSelected);
				if(newValue!=element.value){
					self.selectItem(this);
					element.value=newValue;
					element.valueText=self.getValueText();
					Forms.Utils.fireEvent(element,'change');
				}else{
					if(self.allowSelectNone===true){
						self.deselectItem(this);
						element.value="";
					}
					else
						self.selectItem(this);
				}
				if(self.searchElement!=null)
					self.searchElement.value=self.getValueText();
				self.updateInfo();
			self.change=false;
			};
			
			Forms.Utils.addEvent(containerId, "div", "click", onclick, true);
		},
		updateInfo:function(){
			if(this.ckListInfo!=null)
				this.ckListInfo.innerHTML=this.getValueText();
			//if(this.change)
			//	Forms.Utils.fireEvent($(this.id), "change");
		},
		getValueText:function(){
			var selElement=$(this.itemName+"-"+this.id+"-"+$$(this.id));
			if(selElement!=null)
				return Forms.Utils.innerText(selElement);
			else
				return "";
		}
	};
})();
(function(){
	Forms.AjaxList=function(id,allowSelectNone){
		this.searchElement=$(id);
		Class.create(Forms.AjaxList, Forms.List);
		Forms.List.call(this,id,allowSelectNone);
		this.addSelect("ckList-"+this.id);
		if(this.allowSelectNone==false){
			elem=this.getElements()[0];
			if(elem!=null&&$$(this.id)==="")
				Forms.Utils.click(elem);
		}
		this.valueSelected=$$(this.id);
	};
	Forms.AjaxList.prototype={
		valueSelected:"",
		addSelect:function(containerId){
			var element=$(this.id);
			var self=this;
			this.updateInfo();
			var onclick=function(){
				var newValue=this.id.replace("ajaxItem-"+element.id+"-","");
				var oldElementSelected=$("ajaxItem-"+element.id+"-"+self.valueSelected);
				if(oldElementSelected!=null)
						oldElementSelected.className="ajaxItem";
				if(newValue!=element.value){
					this.className="ajaxItem-selected";
					element.value=newValue;
					self.valueSelected=newValue;
					element.valueText=self.getValueText();
					Forms.Utils.fireEvent(element,'change');
				}else{
					if(self.allowSelectNone===true){
						this.className="ajaxItem";
						element.value="";
					}
					else
						this.className="ajaxItem-selected";
				}
				self.updateInfo();
			};
			
			Forms.Utils.addEvent(containerId, "div", "click", onclick, true);
		},
		updateInfo:function(){
			if(this.ckListInfo!=null)
				this.ckListInfo.innerHTML=this.getValueText();	
			//Forms.Utils.fireEvent($(this.id), "change");
		},
		getValueText:function(){
			var selElement=$("ckItem-"+this.id+"-"+$$(this.id));
			if(selElement!=null)
				return Forms.Utils.innerText(selElement);
			else
				return "";
		}
	};
})();
(function(){
	Forms.Private={
			drag_start:function(event) {
				target=event.target;
				if(target.draggedZone!=undefined)
					target=target.draggedZone;
			    pos=Forms.Private.getPosition(target);
			    mousePos=Forms.Private.getMousePos(event);
				event.dataTransfer.effectAllowed='move';
				event.dataTransfer.setData("text/html",target.getAttribute('id'));

			    event.dataTransfer.setData("text/plain",
			    		(mousePos.x-pos.x) + ',' + (mousePos.y-pos.y));
			    //event.dataTransfer.setData("text/plain",
			    //(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
			},
			drag_over: function(event) { 
			    event.preventDefault(); 
			    return false; 
			}, 
			drop: function(event) { 
			    var offset = event.dataTransfer.getData("text/plain").split(',');
			    var dm = $(event.dataTransfer.getData("text/html"));
			    mousePos=Forms.Private.getMousePos(event);
			    newx=(mousePos.x - offset[0]);
			    newy=(mousePos.y - offset[1]);
			    if(dm.parentNode!=body){
			    	document.body.appendChild(dm);
			    	dm.style.marginLeft="0px";
			    	dm.style.marginTop="0px";
			    }
			    
			    if(newx>0 && newy>0){
			    	dm.style.left = newx + 'px';
			    	dm.style.top = newy + 'px';
			    	dm.style.marginLeft='0px';
			    }
			    event.preventDefault();
			    return false;
			},
			handleDrop:function(event) {
				  if (event.stopPropagation) {
				    event.stopPropagation();
				  }
				  return false;
				},
			getPosition:function(div){
			        var left = 0;
			        var top  = 0;
			        while (div.offsetParent && div.style.position != 'absolute'){
			                left += div.offsetLeft;
			                top  += div.offsetTop;
			                div     = div.offsetParent;
			        }
			        left += div.offsetLeft;
			        top  += div.offsetTop;
			        return {x:left, y:top};
			},
			getMousePos:function(pos){
				if(pos.pageX || pos.pageY){
	                return {x:pos.pageX, y:pos.pageY};
				}
				return {
	                x:pos.clientX + document.body.scrollLeft - document.body.clientLeft,
	                y:pos.clientY + document.body.scrollTop  - document.body.clientTop
				};

			},
			submitForm:function(caption,obj){
				obj.submit(caption);
			},
			getEvent:function(e){
				return e||window.event;
			}
	};
	var self=Forms.Private;
}());
(function(){
	Forms.Controls={
			addCloseButton:function(parentElement,idButton){
				if($(idButton)==null){
					var divClose=document.createElement("div");
					divClose.id=idButton;
					divClose.title="Fermeture";
					divClose.className="closeButton";
					parentElement.appendChild(divClose);
					Forms.Utils.addEventToElement(divClose, "click", function(){Forms.Utils.show(parentElement.id, false);}, false);
				}
			}	
	};
})();
(function(){
	Forms.Utils={
			executeFunctionByName:function (functionName, context, args ) {
				  var args = Array.prototype.slice.call(arguments).splice(2);
				  var namespaces = functionName.split(".");
				  var func = namespaces.pop();
				  for(var i = 0; i < namespaces.length; i++) {
				    context = context[namespaces[i]];
				  }
				  return context[func].apply(this, args);
				},
			addslashes:function(s) {
				s = s.replace(/\\/g,"\\\\");
				s = s.replace(/\'/g,"\\'");
				s = s.replace(/\"/g,"\\\"");
				return s;
			},
			applyFunction:function(func,objects){
				if(Object.isArray(objects)){
					for(var i=0;i<objects.length;i++){
						try{func(objects[i]);}catch(e){}
					}
				}else
					try{func(objects);}catch(e){}
			},
			addDrag: function(dragged){
				dragged.draggable=true;
				dragged.addEventListener('dragstart',Forms.Private.drag_start,false); 
				document.body.addEventListener('dragover',Forms.Private.drag_over,false); 
				document.body.addEventListener('drop',Forms.Private.drop,false); 
				document.body.addEventListener('handledrop',Forms.Private.handleDrop,false);
			},
			addDragByTitle:function(title,draggedZone){
				title.draggable=true;
				title.draggedZone=draggedZone;
				title.addEventListener('dragstart',Forms.Private.drag_start,false); 
				document.body.addEventListener('dragover',Forms.Private.drag_over,false); 
				document.body.addEventListener('drop',Forms.Private.drop,false); 
				document.body.addEventListener('handledrop',Forms.Private.handleDrop,false);
			},
			displays: new Array(),
			setDisplay:function(element,display){
				this.displays[element.id]=element.style.display;
				element.style.display=display;
			},
			restoreDisplay:function(element){
				if(this.displays[element.id]!=undefined)
					element.style.display=this.displays[element.id];
				else
					element.style.display="";	
			},
			ajxlightForm: function(id,title,urlRequest,urlResponse,idResponse,params,onload){
				var lb=new Forms.LightForm(id,title,urlRequest,urlResponse,idResponse,params,onload);
				return lb;
			},
			ajxlightBox: function(id,title,url,params,onload){
				return new Forms.AjaxLightBox(id,title,url,params,onload); 
			},
			lightBox: function(id,title,content){
				lb=new Forms.LightBox(id);
				lb.title=title;
				lb.content=content;
				lb.setAllContent();
				return lb;
			},
			showMessage: function(title,content){
				var sm=new Forms.MessageDialog("sm", title, content,null);
				sm.addButton("Okay",13);
				sm.show();
				return sm;
			},
			insertAfter:function(newElement,targetElement){
				var parent = targetElement.parentNode;
			 	if(parent.lastchild == targetElement) {
					parent.appendChild(newElement);
				} else {
					parent.insertBefore(newElement, targetElement.nextSibling);
				}
			},
			insertBefore:function(newElement,targetElement){
				var parent = targetElement.parentNode;
			 	if(parent.lastchild == targetElement) {
					parent.appendChild(newElement);
				} else {
					parent.insertBefore(newElement, targetElement.previousSibling);
				}
			},
			insertIn:function(newElementId,targetElement){
				newElement=$(newElementId);
				if(newElement==null){
					newElement=document.createElement("div");
					newElement.id=newElementId;
					targetElement.appendChild(newElement);
				}
				return newElement;
			},
			toogle:function(img,elementId){
				var element=$(elementId);
				var reg=/^(.*)(hide.)(.*)$/i;
				var isVisible=reg.test(img.src);
				if(!isVisible){
					show(elementId,true);
					img.src=img.src.replace(/^(.*)(show.)(.*)$/i,"$1hide.$3");
				}else
				{
					show(elementId,false);
					img.src=img.src.replace(/^(.*)(hide.)(.*)$/i,"$1show.$3");
				}
				return !isVisible;
	
			},
			toogleText:function(arrow,elementId,notHide){
				var isVisible=(arrow.className=="arrow-up");
				if(!isVisible){
					show(elementId,true);
					arrow.className="arrow-up";
				}else {
					if(notHide!=true)
						show(elementId,false);
					arrow.className="arrow-down";
				}
				return !isVisible;
			},
			getParent:function(element,tagName){
				if(typeof element ==="string")
					element=$(element);
				if (element!=null){
					if(tagName==undefined)
						return element.parentNode;
					else{
						p=element.parentNode;
						if(p.tagName.toLowerCase()==tagName)
							return p;
						else{
							if(p!=document) return Forms.Utils.getParent(p,tagName);
						}
					}
				}
			},
			getFirstChild:function(element,tagName){
				if(!tagName)
					return (element.firstElementChild||element.firstChild);
				var childs=element.childNodes || element.children;
				for(var k in childs){
					if(childs[k].tagName.toLowerCase()==tagName)
						return childs[k];
				}
			},
			getFileContent:function (url) {
			       var Xhr=self.getXmlHttpRequest();
			       Xhr.open("GET",url,false);
			       Xhr.send(null);
			       return Xhr.responseText;
			    },
		    getXmlHttpRequest:function () {
		    	var GetXmlHttpRequest_AXO=null;
			    if (window.XMLHttpRequest) {
				    return new XMLHttpRequest();
			    }
			    else if (window.ActiveXObject) {
				    if (!GetXmlHttpRequest_AXO) {
					    GetXmlHttpRequest_AXO=pickRecentProgID(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"]);
				    }
				    return new ActiveXObject(GetXmlHttpRequest_AXO);
			    }
			    return false;
		    },			    
			schowDiv:function(element,method){
				if (method && method.toLowerCase() == 'show' )
					this.restoreDisplay(element);
				else
					this.setDisplay(element,"none");
			} ,
			show:function(id,method){
				var obj;
				if(!Object.isString(id)){
					obj=id;
				}
				else{
					if(id!="")
						obj=$(id);
				}
				if(obj!=undefined){
					if (method){
						if(obj.oldDisplay)
							obj.style.display=obj.oldDisplay;
						else
							obj.style.display="";
					}
					else{
						if(obj.style.display!="none")
							obj.oldDisplay=obj.style.display;
						obj.style.display="none";
					}
				}
			},
			showElements:function(elements,method){
				if(Object.isArray(elements)){
					for ( var i = 0; i < elements.length; i++ )
						Forms.Utils.show(elements[i], method);
				}
			},
			showByCN:function(method,className,containerId,tagName){
				if(Object.isString(containerId)){
					if(containerId!="")
						containerId=$(containerId);
					else
						containerId=document;
				}
				if(containerId!=null){
					var elms=Forms.Utils.getElementsByClassName(className, tagName, containerId);
					Forms.Utils.showElements(elms, method);
				}
			},
			showByTN:function(method,tagName,containerId){
				if(Object.isString(containerId)){
					if(containerId!="")
						containerId=$(containerId);
					else
						containerId=document;
				}
				if(containerId!=null){
					var elms=containerId.getElementsByTagName(tagName);
					Forms.Utils.showElements(elms, method);
				}
			},
			$:function(elementId){
				if(elementId!==undefined&&""!==elementId && typeof elementId == "string"){
					if(elementId.toLowerCase()=="body")
						return document.body;
					else
						return document.getElementById(elementId);
				}else
					return "";
			},
			$$:function(elementId){
				if(typeof elementId!="string")
					element=elementId;
				else
					element=$(elementId);
				if(element!=undefined){
					if(element.type!=undefined){
						var type=element.type.toLowerCase();
						switch (type) {
						case 'text': case 'hidden': case 'file' : case 'select-one' : case 'select-multiple' :
							return element.value;
							break;
						case 'checkbox':
							return element.checked;
							break;
						default:
							return element.innerHTML;
							break;
						}
					}
					else
						return  element.innerHTML;
				}
				else
					return "";
			},
			thisQueryString:function(obj){
				var qs="";
				var sep="";
				if(Object.isString(obj))
					obj=$(obj);
				if(obj.id && obj.id!==""){
					value=$$(obj.id);
					qs="request.id="+obj.id;
					sep="&";
				}
				return qs;
					
			},
			dispatchCustomEvent:function(elementId,eventName,data){
				var parent=$(elementId);
				if(parent){
					var event = new CustomEvent(eventName);
					event.initCustomEvent(eventName, true, true, data);
					return parent.dispatchEvent(event);
				}
				return true;
			},
			addEvent:function(container_id,tagName,event,func,before){
				if(document.getElementById(container_id)!==null){
					var events=event.split(',');
					var objects = document.getElementById(container_id).getElementsByTagName(tagName);
				    for ( var i = 0; i < objects.length; i++ ) {
				    	for ( var j=0; j < events.length; j++)
				    		Forms.Utils.addEventToElement(objects[i],events[j],func,before);   	
				    }
				}
			},
			addEventByCN:function(className,event,func,tagName,container){
				if(Object.isString(container))
					container=$(container);
				var objects=Forms.Utils.getElementsByClassName(className, tagName, container);
				for ( var i = 0; i < objects.length; i++ ) {
					Forms.Utils.addEventToElement(objects[i],event,func,false);
				}
			},
			addEventToElements:function(elementName,event,func,before){
				var objects=document.getElementsByName(elementName);
				for ( var i = 0; i < objects.length; i++ ) {
					Forms.Utils.addEventToElement(objects[i],event,func,before);
				}
			},
			addUniqueEvent:function(element,event,func,before,keyCode,force){
				if(element){
					if(!element.myEvents){
						element.myEvents=new Array();
						element.myEvents[event]=func;
						Forms.Utils.addEventToElement(element, event, func, before, keyCode);
					}else{
						if(!element.myEvents[event] || force){
							if(force)
								Forms.Utils.removeEventFromElement(element, event, element.myEvents[event]);
							Forms.Utils.addEventToElement(element, event, func, before, keyCode);
							element.myEvents[event]=func;
						}
					}
				}
			},
			addEventToElement:function(element,event,func,before,keyCode){
				if(event!=null){
					if(event.indexOf(",") !== -1){
						var events=event.split(',');
						for ( var i = 0; i < events.length; i++ ) {
							Forms.Utils.addEventToElement(element,events[i],func,before,keyCode);
						}
						return;
					}
				}
				if(element!=null){
					if(typeof(func)=='string')
						func=eval(func);
					if(event.substring(0, 2)=='on')
						event=event.substring(2,event.length);
					if(element.addEventListener){
						element.addEventListener(event,func,false);}
					else if(element.attachEvent){
						element.attachEvent('on'+event,func);}
					else{
						event='on'+event;
						if(typeof element[event]=='function'){
							var oldListener=objectRef[event];
							if(before==true){
								element[event] = function(){
									func();
									return oldListener();
								};
							}else{
								element[event] = function(){
									oldListener();
									return func();
								};
							}
						}else{
							element[event] = func;}
					}
					if(keyCode!=undefined && event.indexOf("key", 0)!=0)
						if(Object.isNumber(keyCode)){
							Forms.Utils.addEventToElement(document, "keyup",function(obj){Forms.Utils.onKeyUpFireEvent(obj,keyCode,event,element);});
						}
					   if(element.eventListeners==undefined){  element.eventListeners = new Array();};
					   element.eventListeners.push({event : event, func : func , before : before});
				}
			},
			removeEventFromElement:function(element,event,func){
				if(element!=null){
					if(typeof(func)=='string')
						func=eval(func);
					if(event.substring(0, 2)=='on')
						event=event.substring(2,event.length);
					if(element.removeEventListener){
						element.removeEventListener(event,func,false);}
					else if(element.detachEvent){
						element.detachEvent('on'+event,func);}
					else{
						event='on'+event;
						if(typeof element[event]=='function'){
							element[event]='';
						}
					}
				}
			},
			serialize: function(aform,isArray,fromId) {
				if(Object.isString(aform))
					aform=$(aform);
			  var arrayS="";
			  if(isArray)
				  arrayS="[]";
			  if (!aform) return;
			
			  var serial = [], i, j, first;
			  var add = function (name, value) {
			    serial.push(encodeURIComponent(name)+arrayS+'='+encodeURIComponent(value));
			  };
			  var getElement=function(element,fromId){
				if (fromId)
					result=element.id;
				else
					result=element.name;
				return result;
			  };
			
			  var elems ;
			  if (aform.elements)
				  elems= aform.elements;
			  else
				  elems=aform.getElementsByTagName("*");
			  for (i = 0; i < elems.length; i += 1, first = false) {
				  elementId=getElement(elems[i],fromId);
			  	if(elementId!=undefined){
				    if (elementId.length > 0) {
				      switch (elems[i].type) {
				        case 'select-one': first = true;
				        case 'select-multiple':
				          for (j = 0; j < elems[i].options.length; j += 1)
				            if (elems[i].options[j].selected) {
				              add(elementId, elems[i].options[j].value);
				              if (first) break;
				            }
				          break;
				        case 'checkbox':
				        case 'radio': if (!elems[i].checked) break;
				        default: if (elems[i].value && elems[i].value!='') add(elementId, elems[i].value); break;
				      }
				    }
			  	}
			  }
			
			  return serial.join('&');
			},
			getQueryString:function (queryString) {
  				var result = {};
  				if(!queryString)
  					queryString = location.search.substring(1);
  				var re = /([^&=]+)=([^&]*)/g, m;
				while (m = re.exec(queryString)) {
    			result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  				}
				return result;
			},
			replaceWithObjectProperties:function(obj,HTML){
				if(obj!=null&&obj!=undefined&&HTML!=null&&HTML!=undefined){
					for(var propertyName in obj) {
						try{
							if(typeof obj[propertyName] == "string")
								HTML=HTML.replace("{this."+propertyName+"}",obj[propertyName]);
						}catch(e){}
					}
				}
				return HTML;
			},
			setWithReplacement:function(obj,divContent, HTML) {
				if(Object.isString(divContent))
					divContent=$(divContent);
				if(divContent!=null){
					HTML=Forms.Utils.replaceWithObjectProperties(obj, HTML);
					Forms.Utils.setInnerHTML(divContent, HTML);
				}
			},
			setInnerHTML:function(divContent, HTML) {
				if(Object.isString(divContent))
					divContent=$(divContent);
				if(divContent!=null){
					var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
					HTML = HTML.replace(rxhtmlTag, "<$1></$2>");
					if(divContent.type!=undefined){
						var type=divContent.type.toLowerCase();
						switch (type) {
						case 'text': case 'hidden': case 'file' : case 'select-one' : case 'select-multiple' : case 'password' :
							divContent.value=HTML;
							Forms.Utils.fireEvent(divContent, "change");
						default:
								divContent.innerHTML=HTML;
							break;
						}
					}else if(divContent.tagName=="select"){
						divContent.value=HTML;
						Forms.Utils.fireEvent(divContent, "change");
					}
					else{
						divContent.innerHTML=HTML;
					}
					
					var All=divContent.getElementsByTagName("*");
					for (var i=0; i<All.length; i++) {
						All[i].id=All[i].getAttribute("id");
						All[i].name=All[i].getAttribute("name");
						All[i].className=All[i].getAttribute("class");
					}
					self.executeAllScriptIn(divContent);
				}
			},
			executeAllScriptIn:function(divContent){
				var AllScripts=divContent.getElementsByTagName("script");
				for (var i=0; i<AllScripts.length; i++) {
					var s=AllScripts[i];
					if (s.src && s.src!="")
						self.execScript(self.getFileContent(s.src));
					else
						self.execScript(s.text);
				}
			},
			execScript:function(s){
				
				if (window.execScript){
					window.execScript(s.replace('<!--',''));
				}else{
					eval(s);
				}
			},
			innerText:function(element){
				var result="";
				if(document.all)
					result=element.innerText;
				else
					result=element.textContent;
				return result;
			},
			setStyles:function (element, styles)
			{
			    for(var s in styles) {
			        try{
			        	element.style[s] = styles[s];
			        }
			        catch(e){}
			    }
			},
			setClassName:function(className,containerId,tagName){
				var element;
				if(Object.isString(containerId))
					element=$(containerId);
				else
					element=containerId;
				if(element!=null){
					var elements;
					if(tagName!=undefined)
						elements=element.getElementsByTagName(tagName);
					else
						elements=element.getElementsByTagName('*');
					for(var i=0;i<elements.length;i++)
						elements[i].className=className;
				}
				
			},
			addClassName:function(className,containerId,tagName){
				var element;
				if(Object.isString(containerId))
					element=$(containerId);
				else
					element=containerId;
				if(element!=null){
					var elements;
					if(tagName!=undefined)
						elements=element.getElementsByTagName(tagName);
					else
						elements=element.getElementsByTagName('*');
					for(var i=0;i<elements.length;i++)
						elements[i].className=(elements[i].className +" "+className).trim();
				}
				
			},
			removeClassName:function(className,containerId,tagName){
				var element;
				if(Object.isString(containerId))
					element=$(containerId);
				else
					element=containerId;
				if(element!=null){
					var elements;
					if(tagName!=undefined)
						elements=element.getElementsByTagName(tagName);
					else
						elements=element.getElementsByTagName('*');
					for(var i=0;i<elements.length;i++)
						elements[i].className=elements[i].className.replace(new RegExp("(\s*)"+className+"(\s*)"),"").trim();
				}
				
			},
			setClass:function(className,element){
				if(Object.isString(element))
					element=$(element);
				if(element!=null)
					element.className=className;
			},
			addClass:function(className,element){
				if(element instanceof Forms.Elements){
					element.each(function(k,v){Forms.Utils.addClass(className, v);});
				}else{
					if(Object.isString(element))
						element=$(element);
					if(element!=null){
						element.className=element.className.replace(new RegExp("(\s*)"+className+"(\s*)"),"");
						element.className=(element.className+" "+className).trim();
					}
				}
			},
			rmClass:function(className,element){
				if(element instanceof Forms.Elements){
					element.each(function(k,v){Forms.Utils.rmClass(className, v);});
				}else{
					if(Object.isString(element))
						element=$(element);
					if(element!=null)
						element.className=element.className.replace(new RegExp("(\s*)"+className+"(\s*)"),"").trim();
				}
			},
			replaceClass:function(classNameToReplace,newClassName,element){
				if(element instanceof Forms.Elements){
					element.each(function(k,v){Forms.Utils.replaceClass(classNameToReplace,newClassName, v);});
				}else{
					if(Object.isString(element))
						element=$(element);
					if(element!=null)
						element.className=element.className.replace(new RegExp("(\s*)"+classNameToReplace+"(\s*)"),newClassName).trim();
				}
			},
			clearStyles:function (element, styles){
			    for(var s in styles) {
			        try{element.style[s] = "";}
			        catch(e){}
			    }
			},
			getElementInForm:function(formId,elementId){
				var ret;
				form=$(formId);
				if(form!=undefined)
					if(form.tagName.toLowerCase()=='form'){
						for(var i=0;i<form.elements.length;i++){
							if(form.elements[i].id==elementId){
								ret=form.elements[i];
								break;
							}
						}
					}
				return ret;
			},
			getValues:function(name,checked){
				var ret=new Array();
				var elements=document.getElementsByName(name);
				for(var i=0;i<elements.length;i++){
					if(elements[i].value !=undefined && elements[i].value!=""){
						if(checked!=undefined){
							if(elements[i].checked==checked)
								ret.push(elements[i].value);
						}else
							ret.push(elements[i].value);
					}
				}
				return ret.join(";");
			},
			click:function(element){
				if(element!=null){
					try {element.click();}
					catch(e) {
						var evt = document.createEvent("MouseEvents");
						evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
						element.dispatchEvent(evt);
					}
				}
			},
			check:function(checked,className,tag,elm){
				Forms.Utils.applyFunction(function(obj){obj.checked=checked;},Forms.Utils.getElementsByClassName(className,tag,elm));
			},
			fireEvent:function(element,event){
				if(element && element.parentNode){
					if(event.substring(0, 2)=='on')
						event=event.substring(2);
				    if (document.createEventObject){
				        var evt = document.createEventObject();
				        return element.fireEvent('on'+event,evt);
				     }
				     else{
				        var evt = document.createEvent("HTMLEvents");
				        evt.initEvent(event, true, true);
				        return !element.dispatchEvent(evt);
				     }
				}
			},
			execOnKeyUp:function(e,key,execFunc){
				var keycode=null;
				if (window.event) keycode = window.event.keyCode;
					else if (e) keycode = e.which;
				if(keycode==key){
					void(0);
					execFunc(this);
					return false;
				}	
			},
			onKeyUpFireEvent:function(e,key,fireEvent,element){
				if(Forms.DOM.isReallyVisible(element))
					Forms.Utils.execOnKeyUp(e, key, function(){Forms.Utils.fireEvent(element, fireEvent);});
			},
			postOnKeyUp:function(e,key,id,url,params){
				var execFunction=function(){
					var ajx=new Forms.Ajax(id, url, params);
					ajx.post();
				};
				Forms.Utils.execOnKeyUp(e, key, execFunction);
			},
			getOnKeyUp:function(e,key,id,url,params){
				var execFunction=function(){
					var ajx=new Forms.Ajax(id, url, params);
					ajx.post();
				};
				Forms.Utils.execOnKeyUp(e, key, execFunction);
			},
			get:function(id,url,params,func){
				var ajx=new Forms.Ajax(id, url, params,func);
				ajx.get();
			},
			getWR:function(obj,id,url,params,func){
				if(obj!=undefined&&obj!=null){
					id=Forms.Utils.replaceWithObjectProperties(obj, id);
					url=Forms.Utils.replaceWithObjectProperties(obj, url);
					params=Forms.Utils.replaceWithObjectProperties(obj, params);
				}
				$get(id,url,params,func);
			},
			postWR:function(obj,id,url,params,func){
				if(obj!=undefined&&obj!=null){
					id=Forms.Utils.replaceWithObjectProperties(obj, id);
					url=Forms.Utils.replaceWithObjectProperties(obj, url);
					params=Forms.Utils.replaceWithObjectProperties(obj, params);
				}
				$post(id,url,params,func);
			},
			getFormWR:function(obj,formName,id,url,params,func){
				if(obj!=undefined&&obj!=null){
					id=Forms.Utils.replaceWithObjectProperties(obj, id);
					url=Forms.Utils.replaceWithObjectProperties(obj, url);
					params=Forms.Utils.replaceWithObjectProperties(obj, params);
				}
				$getForm(formName,id,url,params,func);
			},
			postFormWR:function(obj,formName,id,url,params,func){
				if(obj!=undefined&&obj!=null){
					id=Forms.Utils.replaceWithObjectProperties(obj, id);
					url=Forms.Utils.replaceWithObjectProperties(obj, url);
					params=Forms.Utils.replaceWithObjectProperties(obj, params);
				}
				$postForm(formName,id,url,params,func);
			},
			post:function(id,url,params,func){
				var ajx=new Forms.Ajax(id, url, params,func);
				ajx.post();
			},
			getForm:function(formName,id,url,params,func){
				var ajx=new Forms.Ajax(id, url, params,func);
				ajx.getForm(formName);
				return ajx;
			},
			postForm:function(formName,id,url,params,func,async){
				var ajx=new Forms.Ajax(id, url, params,func);
				if(async!=undefined)
					ajx.async=async;
				ajx.postForm(formName);
				return ajx;
			},
			Anchor:function(elementToMove,toElement){
				if(Object.isString(elementToMove))
					elementToMove=$(elementToMove);
				if(this.parentAnchor==undefined){
					this.parentAnchor=elementToMove.parentNode;
					Forms.DOM.move(elementToMove, toElement);
				}else{
					Forms.DOM.move(elementToMove, this.parentAnchor);
					this.parentAnchor=undefined;
				}
			},
			onblurText:function(element,text){
				if(element!=null){
					element.onblurText=text;
					element.eType=element.type;
					var _element=element;
					Forms.Utils.addEventToElement(element, "blur", function(){if(_element.value=="") {_element.value=_element.onblurText;_element.type="text";}}, true);
					Forms.Utils.addEventToElement(element, "focus", function(){_element.type=_element.eType;if(_element.value==_element.onblurText) _element.value="";}, true);
				};
			},
			getIdNum:function(obj){
				var result="0";
				if(obj!=null){
					pos=obj.id.lastIndexOf("-");
					if(pos!=-1)
						result=obj.id.substring(pos+1);
				}
				return result;
			},
			getLabelFor:function(obj) {
				var idVal = obj.id;
				labels = document.getElementsByTagName('label');
				for( var i = 0; i < labels.length; i++ ) {
					if (labels[i].htmlFor == idVal)
						return labels[i].innerHTML;
				}
				return idVal;
			},
			/*Code/licensing: http://code.google.com/p/getelementsbyclassname/*/
			getElementsByClassName:function (className, tag, elm){
				if (document.getElementsByClassName) {
					getElementsByClassName = function (className, tag, elm) {
						elm = elm || document;
						var elements = elm.getElementsByClassName(className),
							nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
							returnElements = [],
							current;
						for(var i=0, il=elements.length; i<il; i+=1){
							current = elements[i];
							if(!nodeName || nodeName.test(current.nodeName)) {
								returnElements.push(current);
							};
						}
						return returnElements;
					};
				}
				else if (document.evaluate) {
					getElementsByClassName = function (className, tag, elm) {
						tag = tag || "*";
						elm = elm || document;
						var classes = className.split(" "),
							classesToCheck = "",
							xhtmlNamespace = "http://www.w3.org/1999/xhtml",
							namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
							returnElements = [],
							elements,
							node;
						for(var j=0, jl=classes.length; j<jl; j+=1){
							classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
						}
						try	{
							elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
						}
						catch (e) {
							elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
						}
						while ((node = elements.iterateNext())) {
							returnElements.push(node);
						}
						return returnElements;
					};
				}
				else {
					getElementsByClassName = function (className, tag, elm) {
						tag = tag || "*";
						elm = elm || document;
						var classes = className.split(" "),
							classesToCheck = [],
							elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
							current,
							returnElements = [],
							match;
						for(var k=0, kl=classes.length; k<kl; k+=1){
							classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
						}
						for(var l=0, ll=elements.length; l<ll; l+=1){
							current = elements[l];
							match = false;
							for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
								match = classesToCheck[m].test(current.className);
								if (!match) {
									break;
								}
							}
							if (match) {
								returnElements.push(current);
							}
						}
						return returnElements;
					};
				}
				return getElementsByClassName(className, tag, elm);
			},
			each: function( obj, callback, args ) {
				var value,
					i = 0,
					length = obj.length,
					isArray = Object.isArray( obj );

				if ( args ) {
					if ( isArray ) {
						for ( ; i < length; i++ ) {
							value = callback.apply( obj[ i ], args );

							if ( value === false ) {
								break;
							}
						}
					} else {
						for ( i in obj ) {
							value = callback.apply( obj[ i ], args );

							if ( value === false ) {
								break;
							}
						}
					}

				// A special, fast, case for the most common use of each
				} else {
					if ( isArray ) {
						for ( ; i < length; i++ ) {
							value = callback.call( obj[ i ], i, obj[ i ] );

							if ( value === false ) {
								break;
							}
						}
					} else {
						for ( i in obj ) {
							value = callback.call( obj[ i ], i, obj[ i ] );

							if ( value === false ) {
								break;
							}
						}
					}
				}

				return obj;
			},
			stopPropagation: function(event){
				if (!event) {
					event = window.event;
					event.cancelBubble = true;
				}
				else
					if (event.stopPropagation) event.stopPropagation();
			},
			preventDefault:function(event) {
				 var evt = event ? event:window.event;
				 if (evt.preventDefault) evt.preventDefault();
				 evt.returnValue = false;
				 return false;
			},
			unescapeHTML: function(html) {
			    return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&apos;/g,"'").replace(/&eacute;/g,"é").replace(/&quot;/g,'"').replace(/&frasl;/g,"/");
			},
			isIE:function(){
				return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
			},
			defineTransition:function(element,transition){
				
			},
			getAttr:function(element,attr){
				var value=element[attr];
				if((!value || value=='null') && element.parentNode)
					value=Forms.Utils.getAttr(element.parentNode, attr);
				return value;
			},
			getAttrFromParent:function(element,parentTagName,attr){
				var value;
				if(element.tagName==parentTagName)
					value=element[attr];
				if(!value && element.parentNode)
					value=Forms.Utils.getAttrFromParent(element.parentNode,parentTagName,attr);
				return value;
			},
			valueFromId:function(id){
				var value=id;
				if(value && value.indexOf("-")!=-1){
					value=id.substring(id.indexOf("-")+1);
				}
				return value;
			},
			num:function(id){
				var value=id;
				if(value)
					value=value.replace(/[^0-9]/gi,'');
				return value;
			}
	};
	var self = Forms.Utils;
})();
(function(){
	Forms.DatePicker=function(inputId, dtpId,dtpType,alwaysVisible){
		this.init(inputId,dtpId,dtpType,alwaysVisible);
	};
	Forms.DatePicker.prototype={
			inputId:"",
			dtpId:"",
			dtpType:"date",
			hSelect:false,
			mSelect:false,
			isDate:false,
			isTime:false,
			date:"",
			hours:"",
			minutes:"",
			dateFormat:"dd/MM/yyyy",
			timeFormat:"HH:mm",
			valueFormat:"",
			noHide:false,
			alwaysVisible:true,
			init:function(id,idDtp,dtpType,alwaysVisible){
				if(alwaysVisible!=undefined)
					this.alwaysVisible=alwaysVisible;
				this.inputId=id;
				this.dtpId=idDtp;
				this.dtpType=dtpType;
				this.nbclick=0;
				var sep="";
				if(dtpType.indexOf("date")!=-1){
					this.valueFormat=this.dateFormat;
					sep=" ";
					this.isDate=true;
				}
				if(dtpType.indexOf("time")!=-1){
					this.valueFormat+=sep+this.timeFormat;
					this.isTime=true;
				}
				if($(idDtp)==undefined){
					var idDtpElement=Forms.DOM.createElement("div");
					idDtpElement.id=idDtp;
					idDtpElement.className='dtp';
					Forms.Utils.insertAfter(idDtpElement, $(this.inputId));
					idDtpElement.style.display="none";
				}
				var idi=this.inputId;
				var self=this;
				var maj=function(){
					if(self.noHide!=true){
					$(idi).focused=true;self.updateDtp();self.nbclick=0;
					}
				};
				Forms.Utils.addEventToElement($(this.inputId),"onfocus",maj);
				Forms.Utils.addEventToElement($(this.inputId),"onkeyup",maj);
				Forms.Utils.addEventToElement($(this.inputId),"onchange",maj);
				$(this.inputId).dtp=this;
				if(this.alwaysVisible===false)
					Forms.Utils.addEventToElement($(this.inputId),"onblur",function(){if(self.noHide!=true) self.hide();});
				else
					maj();
			},
			requestDtp:function(d){
				this.noHide=true;
				this.setDtp();
				var self=this;
				var func=function(){
					self.show();
					$(self.inputId).focus();
					self.noHide=false;
					$(self.inputId).focused=true;
				};
				var ajx=new Forms.Ajax(this.dtpId, "d.KDatePicker", "type="+this.dtpType+"&sd="+$$(this.inputId)+"&d="+d+"&id="+this.dtpId+"&inputId="+this.inputId, func);
				ajx.get();
				
			},
			setDtp:function(){
				var oId=$(this.inputId);
				var oIdDtp=$(this.dtpId);
				if(oId!=null && oIdDtp!=null){
					oIdDtp.style.left=oId.style.left;
					oIdDtp.style.top=parseInt(oId.style.top)+parseInt(oId.style.height)+" px";
				}
			},
			updateDtp:function(){
				if($(this.inputId).focused==true){
					this.setDtp();
					var self=this;
					var func=function(){self.show();};
					var ajx=new Forms.Ajax(this.dtpId, "d.KDatePicker", "type="+this.dtpType+"&d="+$$(this.inputId)+"&id="+this.dtpId+"&inputId="+this.inputId, func);
					ajx.get();
				}
				$(this.inputId).focused=true;
				this.noHide=false;
			},
			show:function(){
				Forms.Utils.show(this.dtpId,true);
			},
			hide:function(){
				Forms.Utils.show(this.dtpId,false);
			},
			deselect:function(valueType){
				var container=$("dtp-"+this.dtpId+"-"+valueType);
				if(valueType==="d")
					container=$("dtp-"+this.dtpId);
				if(container!=null){
					var elements=container.getElementsByTagName("div");
					for(var i=0;i<elements.length;i++){
						if(elements[i].className=="dateActive")
							elements[i].className="day";
					}
				}
			},
			setInnerValue:function(d){
				$(this.inputId).value=Forms.Date.formatDate(d, this.valueFormat);
				Forms.Utils.fireEvent($(this.inputId), "change");
				if(this.alwaysVisible===false)
					this.hide();
				this.noHide=false;
			},
			setValue:function(value,type,obj){
				this.deselect(type);
				obj.className="dateActive";
				this.noHide=true;
				//var d=Forms.Date.getDateFromFormat($$(this.inputId), this.valueFormat);
				var d=Forms.Date.parseDate($$(this.inputId),true);
				try{this.date=Forms.Date.formatDate(d, this.dateFormat);}
				catch(ex){
					d=new Date();
					this.date=Forms.Date.formatDate(d, this.dateFormat);}
				
				if(type=="d"){
					this.date=Forms.Date.getDateFromFormat(value, this.dateFormat);
					d.setMonth(this.date.getMonth());
					d.setDate(this.date.getDate());
					d.setYear(this.date.getYear()+1900);
				}
				if(type=="h"){
					this.hours=value;
					d.setHours(value);
					if(this.minutes!="")
						d.setMinutes(this.minutes);
				}
				if(type=="m"){
					this.minutes=value;
					d.setMinutes(value);
					if(this.hours!="")
						d.setHours(this.hours);
				}
				
				if(this.isDate){
					if(this.isTime){
						if(this.date!=""&&this.hours!=""&&this.minutes!=""){
							this.setInnerValue(d);
						}
					}else{
						if(this.date!=""){
							this.setInnerValue(d);
						}
					}
				}else{
					if(this.hours!=""&&this.minutes!=""){
						this.setInnerValue(d);
					}
				}	
			}
	};
})();
(function(){
	Forms.Date={
			MONTH_NAMES:new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'),
			DAY_NAMES:new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat'),
			LZ:function(x) {return(x<0||x>9?"":"0")+x;},
			_isInteger:function(val) {
				var digits="1234567890";
				for (var i=0; i < val.length; i++) {
					if (digits.indexOf(val.charAt(i))==-1) { return false; }
					}
				return true;
				},
			_getInt:function(str,i,minlength,maxlength) {
				for (var x=maxlength; x>=minlength; x--) {
					var token=str.substring(i,i+x);
					if (token.length < minlength) { return null; }
					if (Forms.Date._isInteger(token)) { return token; }
					}
				return null;
				},
			isDate:function(val,format) {
				var date=getDateFromFormat(val,format);
				if (date==0) { return false; }
				return true;
				},
			compareDates:function(date1,dateformat1,date2,dateformat2) {
				var d1=getDateFromFormat(date1,dateformat1);
				var d2=getDateFromFormat(date2,dateformat2);
				if (d1==0 || d2==0) {
					return -1;
					}
				else if (d1 > d2) {
					return 1;
					}
				return 0;
				},
			getDateFromFormat:function(val,format) {
				val=val+"";
				format=format+"";
				var i_val=0;
				var i_format=0;
				var c="";
				var token="";
				var token2="";
				var x,y;
				var now=new Date();
				var year=now.getYear();
				var month=now.getMonth()+1;
				var date=1;
				var hh=now.getHours();
				var mm=now.getMinutes();
				var ss=now.getSeconds();
				var ampm="";
				
				while (i_format < format.length) {
					c=format.charAt(i_format);
					token="";
					while ((format.charAt(i_format)==c) && (i_format < format.length)) {
						token += format.charAt(i_format++);
						}
					if (token=="yyyy" || token=="yy" || token=="y") {
						if (token=="yyyy") { x=4;y=4; }
						if (token=="yy")   { x=2;y=2; }
						if (token=="y")    { x=2;y=4; }
						year=Forms.Date._getInt(val,i_val,x,y);
						if (year==null) { return 0; }
						i_val += year.length;
						if (year.length==2) {
							if (year > 70) { year=1900+(year-0); }
							else { year=2000+(year-0); }
							}
						}
					else if (token=="MMM"||token=="NNN"){
						month=0;
						for (var i=0; i<Forms.Date.MONTH_NAMES.length; i++) {
							var month_name=Forms.Date.MONTH_NAMES[i];
							if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
								if (token=="MMM"||(token=="NNN"&&i>11)) {
									month=i+1;
									if (month>12) { month -= 12; }
									i_val += month_name.length;
									break;
									}
								}
							}
						if ((month < 1)||(month>12)){return 0;}
						}
					else if (token=="EE"||token=="E"){
						for (var i=0; i<Forms.Date.DAY_NAMES.length; i++) {
							var day_name=Forms.Date.DAY_NAMES[i];
							if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
								i_val += day_name.length;
								break;
								}
							}
						}
					else if (token=="MM"||token=="M") {
						month=Forms.Date._getInt(val,i_val,token.length,2);
						if(month==null||(month<1)||(month>12)){return 0;}
						i_val+=month.length;}
					else if (token=="dd"||token=="d") {
						date=Forms.Date._getInt(val,i_val,token.length,2);
						if(date==null||(date<1)||(date>31)){return 0;}
						i_val+=date.length;}
					else if (token=="hh"||token=="h") {
						hh=Forms.Date._getInt(val,i_val,token.length,2);
						if(hh==null||(hh<1)||(hh>12)){return 0;}
						i_val+=hh.length;}
					else if (token=="HH"||token=="H") {
						hh=Forms.Date._getInt(val,i_val,token.length,2);
						if(hh==null||(hh<0)||(hh>23)){return 0;}
						i_val+=hh.length;}
					else if (token=="KK"||token=="K") {
						hh=Forms.Date._getInt(val,i_val,token.length,2);
						if(hh==null||(hh<0)||(hh>11)){return 0;}
						i_val+=hh.length;}
					else if (token=="kk"||token=="k") {
						hh=Forms.Date._getInt(val,i_val,token.length,2);
						if(hh==null||(hh<1)||(hh>24)){return 0;}
						i_val+=hh.length;hh--;}
					else if (token=="mm"||token=="m") {
						mm=Forms.Date._getInt(val,i_val,token.length,2);
						if(mm==null||(mm<0)||(mm>59)){return 0;}
						i_val+=mm.length;}
					else if (token=="ss"||token=="s") {
						ss=Forms.Date._getInt(val,i_val,token.length,2);
						if(ss==null||(ss<0)||(ss>59)){return 0;}
						i_val+=ss.length;}
					else if (token=="a") {
						if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
						else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
						else {return 0;}
						i_val+=2;}
					else {
						if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
						else {i_val+=token.length;}
						}
					}

				if (i_val != val.length) { return 0; }
				if (month==2) {
					if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { 
						if (date > 29){ return 0; }
						}
					else { if (date > 28) { return 0; } }
					}
				if ((month==4)||(month==6)||(month==9)||(month==11)) {
					if (date > 30) { return 0; }
					}

				if (hh<12 && ampm=="PM") { hh=hh-0+12; }
				else if (hh>11 && ampm=="AM") { hh-=12; }
				var newdate=new Date(year,month-1,date,hh,mm,ss);
				return newdate;
				},
			formatDate:function(date,format) {
				format=format+"";
				var result="";
				var i_format=0;
				var c="";
				var token="";
				var y=date.getYear()+"";
				var M=date.getMonth()+1;
				var d=date.getDate();
				var E=date.getDay();
				var H=date.getHours();
				var m=date.getMinutes();
				var s=date.getSeconds();
				var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
				var value=new Object();
				if (y.length < 4) {y=""+(y-0+1900);}
				value["y"]=""+y;
				value["yyyy"]=y;
				value["yy"]=y.substring(2,4);
				value["M"]=M;
				value["MM"]=Forms.Date.LZ(M);
				value["MMM"]=Forms.Date.MONTH_NAMES[M-1];
				value["NNN"]=Forms.Date.MONTH_NAMES[M+11];
				value["d"]=d;
				value["dd"]=Forms.Date.LZ(d);
				value["E"]=Forms.Date.DAY_NAMES[E+7];
				value["EE"]=Forms.Date.DAY_NAMES[E];
				value["H"]=H;
				value["HH"]=Forms.Date.LZ(H);
				if (H==0){value["h"]=12;}
				else if (H>12){value["h"]=H-12;}
				else {value["h"]=H;}
				value["hh"]=Forms.Date.LZ(value["h"]);
				if (H>11){value["K"]=H-12;} else {value["K"]=H;}
				value["k"]=H+1;
				value["KK"]=Forms.Date.LZ(value["K"]);
				value["kk"]=Forms.Date.LZ(value["k"]);
				if (H > 11) { value["a"]="PM"; }
				else { value["a"]="AM"; }
				value["m"]=m;
				value["mm"]=Forms.Date.LZ(m);
				value["s"]=s;
				value["ss"]=Forms.Date.LZ(s);
				while (i_format < format.length) {
					c=format.charAt(i_format);
					token="";
					while ((format.charAt(i_format)==c) && (i_format < format.length)) {
						token += format.charAt(i_format++);
						}
					if (value[token] != null) { result=result + value[token]; }
					else { result=result + token; }
					}
				return result;
				},
				parseDate:function(val) {
					var preferEuro=(arguments.length==2)?arguments[1]:false;
					generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
					monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
					dateFirst =new Array('dd/MM/yyyy','dd/MM/yyyy HH:mm','d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
					var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
					var d=null;
					for (var i=0; i<checkList.length; i++) {
						var l=window[checkList[i]];
						for (var j=0; j<l.length; j++) {
							d=Forms.Date.getDateFromFormat(val,l[j]);
							if (d!=0) { return new Date(d); }
							}
						}
					return null;
					}
			
	};
})();
(function(){
	Forms.AjaxLightBox=function(id, title, url, params,onload){
		Class.create(Forms.AjaxLightBox, Forms.LightBox);
		Forms.LightBox.call(this,id);
		this.initLB(title,url,params,onload);
	};
	Forms.AjaxLightBox.prototype={
			ajax:null,
			onLoad:null,
			initLB:function(title,url,params,onload){
				this.onLoad=onload;
				
				this.title=title;
				this.ajax=new Forms.Ajax('',url);
				this.ajax.onlyContent=true;
				this.ajax.params=params;
				var self=this;
				this.ajax.func=function(){
					self.content=self.ajax.content;
					self.show();
					if (onload!=null) {try{ onload();} catch(e){alert(e+' : '+onload);}}
				};
			},
			get:function(args){
				this.ajax.get(args);
			},
			setParams:function(params){
				this.ajax.params=params;
			}
	};
	
})();
(function(){
	Forms.LightForm=function(id,title,urlRequest,urlResponse,idResponse,params,validCaption,cancelCaption){
		if(validCaption!=undefined)
			this.validCaption=validCaption;
		if(cancelCaption!=undefined)
			this.cancelCaption=cancelCaption;
		this.initLB(id, title, urlRequest, params);
		this.idResponse=idResponse;
		this.urlResponse=urlResponse;
		
	};
	Forms.LightForm.prototype={
			ajxLightBox: null,
			validator: null,
			idResponse :'',
			urlResponse:'',
			validatorEvents:null,
			validatorElements:null,
			validatorFormId:'',
			useValidator:false,
			postFormFunction:function(){return true;},
			cancelFunction:null,
			postParams:'',
			frmName:0,
			validCaption:'Okay',
			cancelCaption:'Annuler',

			initLB:function(id, title, urlRequest, params){
				var data=this;
				var onload=function(){
					data.createValidator();
				};
				var lb=new Forms.AjaxLightBox('ajx'+id, title, urlRequest, params,onload);
				lb.cancelCaption=this.cancelCaption;
				lb.innerAddButton(undefined,this.validCaption,13);
				lb.innerAddButton(undefined,this.cancelCaption,27);
				this.ajxLightBox=lb;
			},
			setOkay:function(validator,idResponse,urlResponse,postParams,postFormFunction,frmName){
				var respFunc=(function(){
					var valid=true;
					if(validator!=null)
							valid=validator.validate();
					if(valid){
						var ajaxResponse=new Forms.Ajax(idResponse,urlResponse,postParams,postFormFunction);
						ajaxResponse.postForm(document.forms[frmName]);
					}
					return valid;
				});
				this.ajxLightBox.waitFor(this.validCaption,respFunc);
				this.ajxLightBox.waitFor(this.cancelCaption,this.cancelFunction);	
			},
			
			addValidator:function(events,elements,id){
				this.validatorEvents=events;
				this.validatorElements=elements;
				this.validatorFormId=id;
				this.useValidator=true;
			},
			createValidator:function(){
				if(this.useValidator){
					if(document.forms[this.frmName]!=undefined)
						this.validator=document.forms[this.frmName].validator;
					else
						this.validator=new Forms.Validator(this.validatorEvents,this.validatorElements,this.validatorFormId,true);
				}
				this.setOkay(this.validator,this.idResponse,this.urlResponse,this.postParams,this.postFormFunction,this.frmName);
			},
			show:function(){
				this.get();
			},
			get:function(){
				this.ajxLightBox.get();
			},
			submit:function(mr){
				return this.ajxLightBox.submit(mr);
			},
			setParams:function(params){
				this.ajxLightBox.setParams(params);
			},
			setModal:function(modal){
				this.ajxLightBox.modal=modal;
			},
			deleteAction:function(action){
				if(this.ajxLightBox!=null)
					this.ajxLightBox.deleteAction(action);
			},
			setBtnCaption:function(btn,newCaption,glyphIcon){
				if(this.ajxLightBox!=null)
					this.ajxLightBox.setBtnCaption(btn,newCaption,glyphIcon);
			}
	};
})();


(function(){
	Forms.Validator=function(events,elements,id,inForm){
		this.init();
		if($(id)!=null)
			$(id).validator=this;
		if(true!=inForm)
			this.controlOn(events, elements, id);
	};
	Forms.Validator.prototype={
		infoElementId:'',
		forms: new Array(),
		elementsToControl: new Array(),
		controlsOnElements: null,
		classNames: new Array(),
		labels: new Array(),
		message: new Array(),
		displayIds: new Array(),
		id: '',
		onInit:false,
		ER: new Array(),
		options:{"showErrorMessage":true,"showId":true,"onErrorFunction":null,"onControlFunction":null,"errorMessageClass":"errMessage"},
		init:function(){
			if(_message==null){
				this.message["@"]="Saisie obligatoire";
				this.message["min"]="Caractère(s) requi(s) au minimum";
				this.message["max"]="Caractère(s) requi(s) au maximum";
				this.message["num"]="Valeurs numériques uniquement";
				this.message["integer"]="Nombre entier uniquement";
				this.message["boolean"]="Booléen attendu";
				this.message["mail"]="Adresse mail non conforme"; 
				this.message["text"]="Caractères uniquement";
				this.message["color"]="Couleur non conforme";
				this.message["alpha"]="Caractères alphanumériques uniquement";
				this.message["date"]="Date au format jj/mm/aaaa requis";
				this.message["datet"]="Date et/ou heure au format jj/mm/aaaa hh:mn requis";
				this.message["datetime"]="Date et heure au format jj/mm/aaaa hh:mn requis";
				this.message["time"]="Heure au format hh:mn requis";
				this.message["url"]="Url commençant par le protocole";
				this.message["tel"]="Téléphone à 10 chiffres";
				this.message["path"]="Chemin invalide";
				this.message["variable"]="Variable invalide";
				this.message["file"]="Nom de fichier incorrect";
				this.message["compare"]="La confirmation de %d n'est pas valide";
			}
			else
				this.message=_message;
			
			if(_ER==null){
				this.ER["@"]=/^.+$/;
				this.ER["num"]=/^[+-]?[0-9]*[\.\,]?[0-9]*$/;
				this.ER["integer"]=/^[\+\-]?[0-9]*$/;
				this.ER["boolean"]=/^(0|1|true|false){1}$/i;
				this.ER["mail"]=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				this.ER["text"]=/^([a-z]|[A-Z])*$/;
				this.ER["color"]=/^#[0-9A-F]+$/;
				this.ER["date"]=/^[0-9]{2,4}(\/|-|\.)[0-9]{1,2}(\/|-|\.)[0-9]{2,4}$/;
				this.ER["time"]=/^[0-9]{1,2}(:)[0-9]{1,2}(:?)[0-9]{0,2}$/;
				this.ER["datet"]=/^[0-9]{2,4}(\/|-|\.)[0-9]{1,2}(\/|-|\.)[0-9]{2,4}([ ][0-9]{1,2}(:)[0-9]{1,2}(:?)[0-9]{0,2})?$/;
				this.ER["alpha"]=/^[0-9A-Za-z]+$/;
				this.ER["datetime"]=/^[0-9]{2,4}(\/|-|\.)[0-9]{1,2}(\/|-|\.)[0-9]{2,4}[ ][0-9]{1,2}(:)[0-9]{1,2}(:?)[0-9]{0,2}$/;
				this.ER["url"]=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				this.ER["tel"]=/^\d\d(-|\.|\s){0,1}\d\d(-|\.|\s){0,1}\d\d(-|\.|\s){0,1}\d\d(-|\.|\s){0,1}\d\d(-|\.|\s){0,1}$/;
				this.ER["path"]=/^[a-z0-9\-_\/\.]+$/i;
				this.ER["variable"]=/^[a-z0-9\-_\.]+$/i;
				this.ER["file"]=/^[a-z0-9\-_\/\.]+$/i;	
				this.ER["string"]=/^.*$/;
			}else
				this.ER=_ER;
		},
		setOptions:function(options){
			this.options=options;
		},
		addOptions:function(options){
			for(var k in options)
				this.options[k]=options[k];
		},
		setOption:function(optionName,value){
			this.options[optionName]=value;
		},
		getOption:function(optionName){
			ret=false;
			if(this.options!=null && this.options[optionName]!=undefined)
				ret=this.options[optionName];
			return ret;
		},
		addControlMessage:function(id,message,ER){
			if(ER!=undefined && ER!="")
				this.ER[id]=ER;
			this.message[id]=message;
		},
		addControlMessages:function(messages){
			if(Object.isArray(messages)){
				for(var i=0;i<messages.length;i++)
					this.addJSONMessage(messages[i]);
			}else if (typeof(messages)=='object')
				this.addJSONMessage(messages);		
		},
		addJSONMessage:function(message){
			if(typeof(message)=='object'){
				idMb="";messageMb="";erMb="";
				for(var member in message){
					if(member.toLowerCase()=='id')
						idMb=member;
					if(member.toLowerCase()=='er')
						erMb=member;
					if(member.toLowerCase()=='message')
						messageMb=member;
					if(idMb!=""&&messageMb!=""){
						if(erMb!="")
							this.addControlMessage(message[idMb],message[messageMb],message[erMb]);
						else
							this.addControlMessage(message[idMb],message[messageMb]);	
					}
				}
			}	
		},
		getControl: function(elementId){
			if(this.controlsOnElements!=null){
				if(this.controlsOnElements[elementId]!=undefined)
					return this.controlsOnElements[elementId];
			}
			if(document.getElementById(elementId)!=undefined)
				return document.getElementById(elementId).alt;
			else
				return "";
		},
		parseFromJSON: function(json){
			this.controlsOnElements=new Array();
			this.elementsToControl=new Array();
			for(var id in json){
				var element=document.getElementById(id);
				if(this.id!='')
					element=Forms.Utils.getElementInForm(this.id, id);
				if(document.getElementById(id)!=undefined){
					if(element!=undefined){
						this.elementsToControl.push(element);
						this.controlsOnElements[id]=json[id];
					}
				}
			}
		},
		addElementsToControl: function(elements){
			this.elementsToControl=new Array();
			var getAllElementsOfAllForms=function(forms){
				var ret=new Array();
				for(var i=0;i<forms.length;i++){
					for(var j=0;j<forms[i].elements.length;j++){
						ret.push(forms[i].elements[j]);
					}
				}
				return ret;
			};
			if(elements!=undefined){
				if(typeof(elements)=='string'){
					try{
						var json=JSON.parse(elements);
						this.parseFromJSON(json);
						}
					catch(ex){}
					
				}
				else if(elements.tagName && elements.tagName.toLowerCase()=='form')
					this.elementsToControl=elements.elements;
				else if(typeof(elements)=='object'){
					try{
							this.parseFromJSON(elements);
						}
					catch(ex){}
				}else
					this.elementsToControl=getAllElementsOfAllForms(document.forms);
			}else
				this.elementsToControl=getAllElementsOfAllForms(document.forms);
		},
		validate:function (){
			var valide=true;
			for(var i=0;i<this.elementsToControl.length;i++){
				try {
					if (!this.scontrol(this.elementsToControl[i])) {
						valide=false;
						}
				}
				catch(ex){}
			}
			if(!valide){
				if(this.getOption('onErrorFunction')!=null && typeof(this.getOption('onErrorFunction'))=='function'){
					try{
						this.getOption('onErrorFunction')(this);
					}
					catch(ex){}
				}
			}
			this.onInit=false;
			return valide;
		},
		//--------------------------------------------------------------------
		controlOn: function(events,elements,id){
			if(id!=undefined && id!=null)
				this.id=id;
			if(events=='')
					events=['onkeyup','onchange'];
			this.addElementsToControl(elements);
			var evts=events;
			if(!Object.isArray(events))
				evts=events.split(',');
			for(var i=0;i<evts.length;i++){
				this.controlOnOneEvent(evts[i]);
			}
			if(this.onInit)
				this.validate();
		},
		//--------------------------------------------------------------------	
		controlOnOneEvent: function(event){
			if(event.indexOf("load")!=-1){
				this.onInit=true;
			}else{
				for(var i=0;i<this.elementsToControl.length;i++){
					var self=this;
					Forms.Utils.addEventToElement(this.elementsToControl[i],event,function () {self.scontrol(this);});
				}
			}
		},
		sControlOne:function(pMyObject,control){
			msg="";
			valeur=pMyObject.value;
			var isValidator=false;
			if(valeur!=undefined && control!="" && control!=undefined){
				if(this.iswhat(control,"integer")){
					valMinMax=Math.abs(control);
					if(control<0){
						if(pMyObject.value.length>valMinMax) 
							msg=" [" + valMinMax + " " + this.message["max"]+"]";
					}else{
						if(pMyObject.value.length<valMinMax) 
							msg=" [" + valMinMax + " " + this.message["min"]+"]";
					}			
				}else if(control==="@"){
					if(!this.iswhat(valeur,"@")){
						if (typeof(this.message["@"])!="undefined")
							msg=" ["+ this.message["@"]+"]";
					}
				}else if(control.indexOf("#")!=-1){
					var onInitStr="";
					if(this.onInit){
						this.onInit=false;
						Forms.Utils.postForm(this.id,"","KSValidator.frm","_field="+pMyObject.id+"&_validatorString="+control+"&_init=true",undefined,false);
					}else{
						var ajx=Forms.Utils.postForm(this.id,"","KSValidator.frm","_field="+pMyObject.id+"&_validatorString="+control+onInitStr,undefined,false);
						msg=ajx.content;
						isValidator=true;
						if(msg.indexOf("class='"+this.options["errorMessageClass"]+"'")!=-1)
							pMyObject.isOnError=true;
					}	
				}else if(control.search(/^\{(.+?)\}$/) != -1){
					control=control.replace("{","").replace("}","");
					ctrl=$(control);
					if(ctrl!=null){
						if(ctrl.value!=valeur)
							msg=" ["+ this.message["compare"].replace("%d",control)+"]";
					}
				}
				else{
					if(!this.iswhat(valeur,control)&&!(valeur.length==0)){
						if (typeof(this.message[control])!="undefined")
							msg=" ["+ this.message[control]+"]";
					}
				}
			}
			if(!isValidator)
				msg=this.setOnError(pMyObject, msg);
			return msg;
		},
		setOnError:function(pMyObject,msg){
			var errMessage=this.options["errorMessageClass"];
			if(msg && msg!=""){
					msg="<span class='"+errMessage+"'>"+msg+"</span>";
					pMyObject.isOnError=true;
			}
			return msg;
		},
	//--------------------------------------------------------------------
		scontrol:function(pMyObject){
			try{
			pMyObject = (document.all)?event.srcElement : pMyObject;
			}catch(e){}
			var nom=this.getControl(pMyObject.id);
			var valeur=pMyObject.value;
			var caption=pMyObject.name;
			var pos0=0;
			var msg="";
			this.cleanmsg(pMyObject);
			pMyObject.isOnError=false;
			if(nom!="" && nom!=undefined && typeof(nom)!="undefined"){
				noms=nom.split(".");
				msg="";
				for(var i=0;i<noms.length;i++)
					msg+=this.sControlOne(pMyObject,noms[i]);
			}
			var isInvalidControl=pMyObject.isOnError;
			if(this.getOption('showErrorMessage'))
				this.displayErrorMessage(pMyObject,msg,isInvalidControl);
			if(this.getOption('onControlFunction')!=null && typeof(this.getOption('onControlFunction'))=='function'){
				try{
					this.getOption('onControlFunction')(pMyObject,msg,isInvalidControl);
				}
				catch(ex){}
			}
			return !isInvalidControl;	
		},
		displayErrorMessage:function(pMyObject,msg,isInvalidControl){
			if(msg && msg!=""){
				this.errormsg(pMyObject,msg);
			}
			if (isInvalidControl)
				{
					Forms.Utils.addClass("fieldOnError", pMyObject);
					Forms.Utils.rmClass("fieldValid", pMyObject);
				}
				else
				{
					Forms.Utils.rmClass("fieldOnError", pMyObject);
					Forms.Utils.addClass("fieldValid", pMyObject);
				}
				if($(this.getErrorId(pMyObject.id))!=undefined){
					Forms.Utils.show(this.getErrorId(pMyObject.id),msg!=undefined && ""!=msg);
				}	
				return !isInvalidControl;
		},
		//--------------------------------------------------------------------	
		iswhat:function(pval,pwhat){
			if (pval.search(this.ER[pwhat]) != -1)
				return true ;
			else
		        return false ;
		},
		
		//--------------------------------------------------------------------	
		errormsg: function(pObject,pmsg){
			idError=this.getErrorId(pObject.id);
			if($(idError)==undefined){
				var err=document.createElement("div");
				err.id=idError;
				err.className='displayMessage';
				if(this.infoElementId!='' && $(this.infoElementId)!=undefined){
					$(this.infoElementId).appendChild(err);
					this.displayIds[pObject.id]=true;
				}
				else{
					Forms.Utils.insertAfter(err, pObject);
					this.displayIds[pObject.id]=false;
				}
			}else if(this.displayIds[pObject.id]==undefined)
				this.displayIds[pObject.id]=true;
			
			if(this.displayIds[pObject.id])
				pmsg=this.getLabel(pObject)+" : "+pmsg;
			$set(idError,pmsg);
		},
		getLabel:function(obj){
			id=obj.id;
			if(this.labels[id]==undefined)
				this.labels[id]=Forms.Utils.getLabelFor(obj);
			return this.labels[id];
		},
		//--------------------------------------------------------------------	
		cleanmsg: function(pObject){
			if($(this.getErrorId(pObject.id))!=undefined)
				$(this.getErrorId(pObject.id)).innerHTML='';
		},
		getErrorId:function(id){
			if(this.id=='')
				return 'error-'+id;
			else
				return 'error-'+this.id+'-'+id;
		}
	};
})();

(function(){
	function supportAjaxUploadWithProgress() {
		  return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();

		  // Is the File API supported?
		  function supportFileAPI() {
		    var fi = document.createElement('INPUT');
		    fi.type = 'file';
		    return 'files' in fi;
		  };

		  // Are progress events supported?
		  function supportAjaxUploadProgressEvents() {
		    var xhr = new XMLHttpRequest();
		    return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
		  };

		  // Is FormData supported?
		  function supportFormData() {
		    return !! window.FormData;
		  }
		}
	
	Forms.Ajax=function(id,url,params,func,indicator){
		this.id=id;
		this.url=url;
		this.params=params;
		this.func=func;
		this.indicator=indicator;
		return this;
	};
	Forms.Ajax.prototype={
		id:'',
		url:'',
		params:'_ajx',
		indicator:null,
		func:null,
		method:'GET',
		content:'',
		onload: null,
		onlyContent:false,
		async: true,
		isUpload:false,
		noIndicator:false,
		uid:"",
		load:function(args){
			this.uid=this.url+"."+this.params+"."+this.method;
			if(requests.indexOf(this.uid)>-1)
				return;
			else
				(requests.push(this.uid));
			var xObj;
			var _this=this;
			var _args=args;
			if(!this.isUpload){
				if(this.params==undefined || this.params=="")
					this.params="_ajx";
				if(this.params.indexOf("_ajx")==-1)
					this.params+="&_ajx";
				if(!this.indicator && !this.noIndicator)
					this.indicator=$("main-ajax-loader");
				if (this.indicator && !this.noIndicator)
					Forms.Utils.show(this.indicator.id,true);
			}
			this.method=this.method.toUpperCase();
			xObj=this.getXhrequest();
			if(this.isUpload)
				this.initUpload(xObj);
			document._ajx=true;
			if(this.async){
				xObj.onreadystatechange=function(){ 
					if(xObj.readyState  == 4){
						var i=requests.indexOf(_this.uid);
						if(i>-1)
							requests.splice(i, 1);
						if (!_this.noIndicator && _this.indicator!=null)
							Forms.Utils.show(_this.indicator.id,false); 
						if(xObj.status  == 200){
							_this.content=xObj.responseText;
							if(_this.id && document.getElementById(_this.id)!=undefined)
									Forms.Utils.setInnerHTML(document.getElementById(_this.id),xObj.responseText);
								else{
									if(xObj.responseText && xObj.responseText.isJSON()){
										var obj=JSON.parse(xObj.responseText);
										if(obj)
											Forms.DOM.JSONToDomElements(obj);
									}
									if(!_this.onlyContent){
										var hiddenDiv=Forms.DOM.createElement("div");
										hiddenDiv.style.display="none";
										Forms.Utils.setInnerHTML(hiddenDiv, xObj.responseText);
									}
								}
								if (_this.func!=null) {
									if(_this.func.constructor === Array){
										for(var i=0;i<_this.func.length;i++){
											try{ _this.func[i](_this.id,_args);} catch(e){alert(e);}
										}
									}else{
										try{ _this.func(_this.id,_args);} catch(e){alert(e);}
									}
								}
								if(document.readyList instanceof Array){
									var i=0;
									var nb=document.readyList.length;
									while(i<nb){
										try{document.readyList[0]();} catch(e){}
										document.readyList.splice( 0, 1 );
										i++;
									}
								}
							 }
						else 
						{
							if(document.getElementById(_this.id)!=undefined)
								document.getElementById(_this.id).innerHTML="Erreur " + xObj.status+"->"+_this.url;
							}
					}
				};
			}else{
				if (!_this.noIndicator && _this.indicator!=null)
					Forms.Utils.show(_this.indicator.id,false); 
			}
			if (this.method=='GET')
				xObj.open( this.method, this.url+this.getSep()+this.params, this.async);
			else{
				xObj.open( this.method, this.url, this.async);
				this.setPostHeader(xObj);
			}
			xObj.send(this.params);
			if(!this.async)
				this.content=xObj.responseText;
		},
		getSep:function(){
			var result="?";
			if(this.url.indexOf("?")!=-1)
				result="&";
			return result;
		},
		get:function(args){
			this.method='GET';
			this.load(args);
		},
		post:function(args){
			this.method='POST';
			this.load(args);
		},
		postForm:function(form,args){
			this.method='POST';
			this.params+="&"+Forms.Utils.serialize(form);
			this.load(args);
		},
		getForm:function(form,args){
			this.method='GET';
			this.params+="&"+Forms.Utils.serialize(form);
			this.load(args);
		},
		getXhrequest:function(){
			var xhrequest;
			try {xhrequest = new XMLHttpRequest(); }
			catch(e) 
			{xhrequest = new ActiveXObject("Microsoft.XMLHTTP");}
			return xhrequest;
		},
		setPostHeader:function(xObj){
			try{
				if(!this.isUpload)
					xObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
			}catch(e){}
		},
		upload:function(element){
			var formData = new FormData();
			for(var i=0;i<element.files.length;i++){
				formData.append('file'+i, element.files[i]);
			}
			formData.append("_ajx",true);
			this.method='POST';
			this.isUpload=true;
			if(this.params){
				queryString=Forms.Utils.getQueryString(this.params);
				for(var variable in queryString)
					formData.append(variable, queryString[variable]);
			}
			this.params=formData;
			this.load();
		},
		initUpload:function(xhrequest){
			if(supportAjaxUploadWithProgress()){
				var _this=this;
				var onloadstartHandler=function(evt) {
					  var div = document.getElementById(_this.id);
					  Forms.Utils.setInnerHTML(div, "<div id='progress'><p>Upload...<strong>0%</strong></p><progress value='5' min='0' max='100'>0%</progress></div>");
				};
				var onprogressHandler=function(evt) {
				  var percent = Math.floor(evt.loaded/evt.total*100);
				  (new $e('#progress progress')).attr('value',percent);
				  (new $e('#progress strong')).html(percent+"%");
				};
				xhrequest.upload.addEventListener('loadstart', onloadstartHandler, false);
				xhrequest.upload.addEventListener('progress', onprogressHandler, false);
			}
		}
	};
	//Membres privés
	var self=Forms.Ajax;
})();

//----------------------------------------------------------------------------------------------------------
getCheckedValue=function(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
};
getCheckedValues=function(checkedObj) {
	var ret="";
	if(!checkedObj)
		ret= "";
	else{
		var checkedLength = checkedObj.length;
		if(checkedLength == undefined){
			if(checkedObj.checked)
				ret= checkedObj.value;
			else
				ret="";
		}
		else{
			for(var i = 0; i < checkedLength; i++) {
				if(checkedObj[i].checked) {
					ret+=checkedObj[i].value+",";
				}
			}
			if(ret.length>0)
				ret=ret.substr(0,ret.length-1);
		}
	}
	return ret;
};
(function(){
	Forms.FormUtils={
		addOpacity:function(element){
			if(element){
				var opacityElement=Forms.DOM.insertIn(element.id+"-opcacity", element, "div");
				opacityElement.className="opacity";
				var range=Forms.DOM.insertIn(opacityElement.id+"-range", opacityElement, "input");
				range.type="range";
				range.title="Transparence";
				range.min=10;range.max=100;range.value=Forms.DOM.getOpacity(element);range.step=10;
				Forms.Utils.addEventToElement(element, "mouseout,blur",function(e){if(Forms.DOM.isMouseOut(e, element)){Forms.DOM.setOpacity(element, range.value);}} );
				Forms.Utils.addEventToElement(element, "focus,click",function(){Forms.DOM.setOpacity(element, 100);} );
			}
		},
		addCloseButton:function(element,func){
			if(element){
				var button=Forms.DOM.insertIn(element.id+"-closeButton", element, "div");
				button.className="closeDiv";
				button.title="Fermer";
				Forms.Utils.addEventToElement(button, "click",function(){Forms.Utils.show(element.id, false);if(func) func();} );
			}
		}
	};
})();
(function(){
	Forms.Framework={
			
		VERSION:"1.0.0.25d",
		getRandomUID:function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			    return v.toString(16);
			});
		},
		insertRow:function(idTable){
			tableElement=$(idTable);
			if(tableElement!=null){
				var row=tableElement.insertRow(-1);
				num=tableElement.rows.length;
				row.innerHTML=tableElement.rows[1].innerHTML.replace(/-0/g,"-"+num);
				var All=tableElement.rows[1].getElementsByTagName("*");
				for (var i=0; i<All.length; i++) {
					e=All[i];
					if(e.id!==""){
						newId=e.id.replace(/-0/g,"-"+num);
						other=$(newId);
						if(other!=null){
							if(e.eventListeners!=undefined){
								for(var j=0;j<e.eventListeners.length;j++){
									Forms.Utils.addEventToElement(other, e.eventListeners[j].event, e.eventListeners[j].func,false);
								}
							}
						}
					}
				}
				row.id='line-'+num;
				return row;
			}
		},
		updateRow:function(caller,idTable,id,num){
			s=$(idTable).rows.length-2;
			if(caller.id.substring(0,6) !== 'delete'||num!=s){
				updatedElement=$("updated"+id+"-"+num);
				if(updatedElement.value=="0"){
					updatedElement.value="1";
					row=Forms.Framework.insertRow(idTable);
					var func=function(){var numLigne=Forms.Utils.getIdNum(this);Forms.Framework.updateRow(this,idTable,id,numLigne);};
					Forms.Utils.addEvent(row.id,'input','change',func);
				}else
					updatedElement.value=eval(updatedElement.value)+1;
			}
		},
		checkRowToDelete:function(obj){
			var classname="deleteRow";
			var parent=Forms.Utils.getParent(obj.id, "tr");
			if(parent!=null){
				if(obj.checked)
					Forms.Utils.addClassName(classname, parent);
				else
					Forms.Utils.removeClassName(classname, parent);
			}
		},
		toogle:function(id,e){
				var target=$gte(e);
				var shortId=id.substring(0,id.indexOf('-'));
				var idl='idL'+id;
				var pn=$('idTR'+shortId);
				var toogleInput=Forms.Framework.getToToogleInput();
				if(pn.counter==undefined) pn.counter=0;
				var visible=($('imgToogle'+id).className!='arrow-up');
				if(visible){pn.counter=pn.counter+1;}else{pn.counter=pn.counter-1;}
				if(target)
					target.toogled=visible;
				Forms.Utils.toogleText($('imgToogle'+id),'idTR'+shortId,pn.counter>0);
				if(visible){
					var move=$('idL'+id);
					parent=move.parentNode;
					move.parentNode.removeChild(move);
					$('idDiv'+id).appendChild(move);
					$(idl).parentNode.className='selectKlist';
					move.className='Klist';
					toogleInput.value=toogleInput.value+";"+id;
				}else{
					var move=$(idl);
					move.parentNode.removeChild(move);
					parent.appendChild(move);
					if(pn.counter==0)
						$(idl).parentNode.className='';
					toogleInput.value=toogleInput.value.replace(";"+id,"");
				}
				show('idDiv'+id,visible);
				show(idl,visible);
		},
		getToToogleInput:function(){
			var input=$('_toToogle');
			if(input==null){
				input=document.createElement("input");
				input.id="_toToogle";
				input.type="hidden";
				document.body.appendChild(input);
			}
			return input;
		},
		getToToogleValue:function(){
			var result="";
			var input=Forms.Framework.getToToogleInput();
			if(input!=null)
				result=input.value;
			return result;
		},
		toogleAll:function(all){
			var toogleInput=Forms.Framework.getToToogleInput();
			toogleInput.value="";
			var divs=all.split(";");
			for(var i=0;i<divs.length;i++){
				if(divs[i]!=="" && $("idL"+divs[i])!=null)
					Forms.Framework.toogle(divs[i]);
			}
		},
		checkSubmitFormButton:function(containerId,id,caption){
			if($(containerId)){
				var elm=new Forms.Elements("#"+id);
				var btn=elm.getFirst();
				if(btn){
					if(caption!=undefined && btn.tagName=="input")
						btn.value=caption;
				}else{
					btn=Forms.DOM.insertIn(id, $(containerId), "input");
					btn.type="button";
					btn.value=caption;
					btn.className="btn";
				}
			}
		},
		filtre:function(targetId,url,queryString,parentListId){
			var parent=$(parentListId);
			if(parent){
					if(window.CustomEvent){
						var result=Forms.Framework.gotoPageDispatchEvent(parentListId,1);
						if(result)
							Forms.Utils.post(targetId,url,queryString);
					}else
						Forms.Utils.post(targetId,url,queryString);
			}else
				Forms.Utils.post(targetId,url,queryString);
		},
		gotoPage:function(targetId,url,queryString,parentListId,pageNum,sort){
			var parent=$(parentListId);
			if(parent){
				if(parent.activePage!=pageNum ||sort){
					if(window.CustomEvent){
						var result=Forms.Framework.gotoPageDispatchEvent(parentListId,pageNum);
						if(result)
							Forms.Utils.get(targetId,url,queryString);
					}else
						Forms.Utils.get(targetId,url,queryString);
				}
			}else
				Forms.Utils.get(targetId,url,queryString);
		},
		gotoPageDispatchEvent:function(parentListId,pageNum){
			var parent=$(parentListId);
			var result=true;
			if(parent){
				if(parent.selector)
					result=parent.selector.dispatchEvent("1");
				if(result)
					result=Forms.Utils.dispatchCustomEvent(parentListId, "pagechange", {"page":pageNum,"oldPage":parent.activePage});
			}
			return result;
		},
		afterGotoPageDispatchEvent:function(parentListId,pageNum){
			var parent=$(parentListId);
			if(parent)
				parent.activePage=pageNum;
			return Forms.Utils.dispatchCustomEvent(parentListId, "pagechanged", {"page":pageNum});
		},
		infoBulle:function(id,caption,itemsTitle,type,visible,num,elementsSelector,infoBulleParentId){
			var vtype="";
			if(type)
				vtype=" "+type;
			var infoBulleId=id.replace(new RegExp("\\W","g"),"")+"-infoBulle-"+type;
			if(num!=undefined)
				infoBulleId=infoBulleId+num;
			var infoBulle=$(infoBulleId);
			if(infoBulle==undefined){
				var elementRef=Forms.Framework.getContainer(id);
				infoBulle=Forms.DOM.insertIn(infoBulleId, elementRef, "div");
				if(infoBulle!=null){
					if(infoBulleParentId)
						infoBulle.infoBulleParentId=infoBulleParentId;
					infoBulle.containerId=id;
					infoBulle.elementsSelector=elementsSelector;
					infoBulle.appendChild(document.createTextNode(type+" : "));
					var captionElement=Forms.DOM.insertIn(infoBulleId+"-caption", infoBulle, "span");
					captionElement.setAttribute("class","client-debug-selector");
					captionElement.appendChild(document.createTextNode(caption));
					infoBulle.className="debugInfoBulle"+vtype;
					new Forms.Elements("#"+infoBulle.id+" .infoBulle-title").show(false);
					Forms.Utils.addDrag(infoBulle);
					
					infoBulleTitle=Forms.DOM.insertIn(infoBulle.id+"-title", infoBulle, "div");
					infoBulleTitle.setAttribute("class","infoBulle-title");
					infoBulleTitle.style.display="none";
					Forms.InfoBulleUtils.createInfoBulleTitle(infoBulleTitle, itemsTitle);
					if(elementsSelector && elementsSelector!="")
						infoBulle.infoBulleElements=new Forms.Elements(elementsSelector);
					else
						infoBulle.infoBulleElements=elementRef;
					infoBulle.selectedDivs=new Array();
				}
					var showTitle=function(e){
						event=e||window.event;
						if(event.ctrlKey==1){
							Forms.Utils.stopPropagation(event);
							if(infoBulle.showTitle){
								infoBulle.showTitle=false;
								new Forms.Elements("#"+infoBulle.id+" .infoBulle-title").show(false);
								Forms.Framework.hideInfoBulleElement(infoBulle);
							}else{
								infoBulle.showTitle=true;
								new Forms.Elements("#"+infoBulle.id+" .infoBulle-title").show(true);
							}
						}
						if(event.shiftKey){
							Forms.Utils.stopPropagation(event);
							var container=new Forms.Elements(infoBulle.containerId);
							if(infoBulle.showElement){
								infoBulle.showElement=false;
								Forms.Utils.rmClass("selectedElement", container);
							}else{
								infoBulle.showElement=true;
								Forms.Utils.addClass("selectedElement", container);
							}
						};
					};
					Forms.Utils.addEventToElement(infoBulle, "mouseenter", function(){Forms.InfoBulleUtils.showSelectedParent(infoBulle,true);});
					Forms.Utils.addEventToElement(infoBulle, "mouseout", function(e){if(Forms.DOM.isMouseOut(e, infoBulle)) Forms.InfoBulleUtils.showSelectedParent(infoBulle,false);});
					Forms.Utils.addEventToElement(infoBulle, "click", showTitle);
			}

			Forms.Framework.showHideBulle(infoBulle, visible);
			return infoBulle;
		},
		getContainer:function(id){
			var elms=new Forms.Elements(id);
			var elementRef;
			if(elms.length()>0)
				elementRef=elms.get(0);
			else
				elementRef=document.body;
			return elementRef;
		},
		checkContainer:function(infoBulle){
			if(infoBulle){
				var container=new Forms.Elements(infoBulle.containerId).getFirst();
				if(container && infoBulle.parentNode!=container){
					Forms.DOM.move(infoBulle, container);
					infoBulle.style.top="";
					infoBulle.style.left="";
				}
				var elementsSelector=infoBulle.elementsSelector;
				if(elementsSelector && elementsSelector!="")
					infoBulle.infoBulleElements=new Forms.Elements(elementsSelector);
				else
					infoBulle.infoBulleElements=infoBulle.parentNode;
			}
			return (infoBulle.containerId=="body" || infoBulle.parentNode!=document.body);

		},
		showHideBulle:function(infoBulle,visible){
			if(infoBulle!=null){
				var containerExists=Forms.Framework.checkContainer(infoBulle);
				if(visible==false || (infoBulle.style.display!="none" && visible==undefined) || (!containerExists && $("showOnlyActiveBulles").checked==true) ){
					infoBulle.style.display="none";
					Forms.Framework.hideInfoBulleElement(infoBulle);
				}
				else if(visible!=undefined){					
					infoBulle.style.display="";
					infoBulle.style.zIndex=Forms.DOM.getMaxZIndex(".debugInfoBulle")+1;
				}
			}
		},
		ckInfoBulleMenuLoad:function(){
			var elements=new Forms.Elements("#ckList-clientDebug .item");
			elements.each(function(k,v){
				Forms.Framework.ckInfoBulleMenu(v);
			});
			
		},
		ckInfoBulleMenu:function(e){
			var selected=Forms.Private.getEvent(e).target || e;
			var elms=new Forms.Elements("."+Forms.Utils.innerText(selected));
			var checked=Forms.DOM.hasClass(selected, "ckItem-selected");
			for(var i=0;i<elms.length();i++){
				if(!checked){
					elms.get(i).style.display="none";
					Forms.Framework.hideInfoBulleElement(elms.get(i));
				}
				else
					Forms.Framework.showHideBulle(elms.get(i), true);
			}
		},
		hideInfoBulleElement:function(infoBulle){
			if(infoBulle)
				if(infoBulle.infoBulleElements){
					Forms.Utils.rmClass("selectedElement", infoBulle.infoBulleElements);
					infoBulle.showElement=false;
				}
		},
		infoBulleSearch:function(){
			textSearch=$$('debugElementSearch');
			if(textSearch.length>1){
				new Forms.Elements(".searchText").each(function(k,v){
					var parent=v.parentNode;
					parent.replaceChild(document.createTextNode(v.textContent), v);
				});
				new Forms.Elements(".debugInfoBulle").each(function(k,v){
							Forms.DOM.matchText(v, new RegExp(textSearch, "i"), function(node, match, offset) {
							    var span = document.createElement("span");
							    span.className = "searchText";
							    span.textContent = match;
							    node.parentNode.insertBefore(span, node.nextSibling); 
							    Forms.Framework.showHideBulle(v, true);
								new Forms.Elements("#"+v.id+" .infoBulle-title").show(true);
							});
						}
				);
			}
			return false;
		},
		initShowTpl:function(){
			(new Forms.Elements("input")).each(function(k,v){
				if(v.id && $("value-"+v.id)){
					Forms.Utils.addEventToElement(v, "change",function(){Forms.Utils.setInnerHTML("value-"+v.id, v.value);} );
				}
			});
		},
		addNavigationKeys:function(parentListId,pageNum){
			Forms.Framework.afterGotoPageDispatchEvent(parentListId,pageNum);
			var keyUpFunction=function(e){
				var keycode=null;
				if (window.event) keycode = window.event.keyCode;
					else if (e) keycode = e.which;
				if(e.shiftKey){
					//e.preventDefault;
					var btn=null;
					switch (keycode) {
					case 33://pageUp
						btn="_previous";
						break;
						
					case 34://PageDown
						btn="_next";
						break;
						
					case 36://home
						btn="_home";
						break;
						
					case 35://end
						btn="_end";
						break;
						
					default:
						break;
					}
					if(btn)
						Forms.Utils.fireEvent($(btn), "click");
//					void(0);
//					Forms.Utils.stopPropagation(e);
//					return Forms.Utils.preventDefault(e);
				}
			};
			Forms.Utils.addUniqueEvent(document, "keydown", keyUpFunction, true,undefined,true);
		},
		addEditableFields:function(){
			var elements=new Forms.Elements("td .editable");
			elements.addEvent("dblclick", function(e){
				var target=$gte(e);
				var newE=Forms.DOM.replaceElement(undefined, target, "input", true);
				newE.type="text";
				Forms.Utils.addEventToElement(newE, "focusout", function(e){
					var newETarget=$gte(e);
					if(!newETarget.deleted)
						Forms.DOM.restoreReplacedElement(newETarget, false);
				});
				Forms.Utils.addEventToElement(newE, "keyup", function(e){
					var touche=$gkc(e);
					var newETarget=$gte(e);
					switch (touche) {
					case 13:
						newETarget.deleted=true;
						var restoredElement=Forms.DOM.restoreReplacedElement(newETarget, true);
						Forms.Utils.fireEvent(restoredElement, "updated");
						break;
					case 27:
						if(!newETarget.deleted)
							Forms.DOM.restoreReplacedElement(newETarget, false);
						break;
					default:
						break;
					}
				});
			});
		},
		opShowDifferences:function(){
			var same=true;
			(new $e("div")).each(function(k,v){Forms.Utils.rmClass("idem", v);Forms.Utils.rmClass("updated", v);Forms.Utils.rmClass("new", v);});
			(new $e("div[id^='cp-']")).each(function(k,v){
				var id=v.id.replace("cp-","");
				var elm=$(id);
				if(elm){
					if(elm.innerHTML==v.innerHTML.replace(/\<input.*?type\=\"checkbox\".*?\>/g,"").replace(/cp\-/g,"")){
						Forms.Utils.addClass("idem", $(id));
						Forms.Utils.addClass("idem", v);
					}else{
						Forms.Utils.addClass("updated", $(id));
						Forms.Utils.addClass("updated", v);
						same=false;
					}
				}else{
					Forms.Utils.addClass("new", v);
					same=false;
				}
					
			});
			if(!same){
				$set($('infos'),'Les fichiers comportent des différences');
			}else
				$set($('infos'),'Les 2 fichiers sont identiques');
			
			Forms.Utils.show("btTest", !same);
			(new $e("#copy input[type=checkbox]")).addEvent("click",function(e){
				var someChecked=false;
				var target=$gte(e);
				(new $e("input[type=checkbox]",target.parentNode)).each(function(k,v){
					v.checked=target.checked;
					});
				someChecked=(new $e("#copy input[type=checkbox]:checked")).length()>0;
				Forms.Utils.show("btTestChecked", someChecked);
			});
		},
		createBtn:function(container,id,caption,extClassName,intClassName){
			var bt=Forms.DOM.insertIn(id, container, "div");
			bt.className=extClassName;
			var btSpan=Forms.DOM.insertIn("span-"+id, bt, "span");
			btSpan.appendChild(document.createTextNode(caption));
			btSpan.className=intClassName;
			return bt;
		}
	};
})();
(function(){
	Forms.InfoBulleUtils={
			init:function(){
				Forms.Utils.addDrag($('clientDebugMenu'));
				new Forms.Elements('#field-clientDebug .item').addEvent('click',function(e){Forms.Framework.ckInfoBulleMenu(e);});
				Forms.Utils.addEventToElement($('showOnlyActiveBulles'), "click", function(){Forms.Framework.ckInfoBulleMenuLoad();});
				$("libVersion").innerHTML="Librairie Forms-"+Forms.Framework.VERSION;
				Forms.FormUtils.addOpacity($('clientDebugMenu'));
				Forms.FormUtils.addCloseButton($('clientDebugMenu'),function(){if(Forms.Framework.DeboggerObject.created)(new $debogger()).closeAndTerminate();});
			},
			getTitleCaption:function(element,value){
				var lbl=document.createElement("label");
				lbl.appendChild(document.createTextNode(value));
				element.appendChild(lbl);
				return element;
			},
			getTitleValue:function(element,value){
				value=Forms.Utils.unescapeHTML(value);
				value=value.split("|");
				var href=document.createElement("a");
				if(value.length>0){
					href.appendChild(document.createTextNode(value[0]));
					if(value.length>1)
						href.setAttribute("title",value[1]);
				}
				element.appendChild(href);
				return element;
			},
			createInfoBulleTitle:function(container,items){
				Forms.DOM.createTableFromAssoArray(container, items, [Forms.InfoBulleUtils.getTitleCaption,Forms.InfoBulleUtils.getTitleValue]);
			},
			showSelected:function(infoBulle,visible){
				Forms.Framework.checkContainer(infoBulle);
				if(visible){
					Forms.Utils.addClass("selectedParent", infoBulle);
					Forms.Framework.showHideBulle(infoBulle, true);
					//Forms.Utils.show(infoBulle.id, true);
					infoBulle.style.zIndex=Forms.DOM.getMaxZIndex(".debugInfoBulle")+1;
				}
				else{
					Forms.Utils.rmClass("selectedParent", infoBulle);
				}
			},
			showSelectedParent:function(infoBulle,visible){
				new Forms.Elements(".debugInfoBulle").each(function(k,v){
					if(v.id==infoBulle.infoBulleParentId){
						if(visible){
							Forms.Framework.checkContainer(v);
							Forms.Utils.addClass("selectedParent", v);
							Forms.Framework.showHideBulle(v, true);
							v.style.zIndex=Forms.DOM.getMaxZIndex(".debugInfoBulle")+1;
						}
						else{
							Forms.Utils.rmClass("selectedParent", v);
						}
					}
				}
				);
			}
	};
})();

(function(){
	Forms.Framework.JsExpression=function(script,caption,infoBulleId,isBreakPoint,exeExpression){
		this.script=script;
		this.caption=caption;
		this.isBreakPoint=isBreakPoint;
		this.infoBulleId=infoBulleId;
		this.exeExpression=exeExpression;
		return this;
	};
	Forms.Framework.JsExpression.prototype={
			script:"",
			isBreakPoint:false,
			caption:"",
			infoBulleId:"",
			exeExpression:""
	};
})();

(function(){
	var instance=null;
	var executionCounter=0;
	var hideFiltre=false;
	var stopDebug=false;
	var addExpressionInGui=function(jsExpression){
		var selectElement=$("listExpressions");
		var option=Forms.DOM.addOptionToSelect(Forms.Utils.unescapeHTML(jsExpression.caption), jsExpression.infoBulleId, selectElement);
		if(option!=null){
			if(jsExpression.isBreakPoint){
				Forms.Utils.addClass("breakPoint", option);
			};
		};
	};

	var getFilter=function(){
		var filter;
		if($('filterDebug')==null){
			filter=document.createElement("div");
			filter.style.display='none';
			filter.id='filterDebug';
			document.body.appendChild(filter);
		}else
			filter=$('filterDebug');
		return filter;
	};
	showFilter=function(show){
		var filter=getFilter();
		if(show)
			filter.style.display='block';
		else
			filter.style.display='none';
	};
	Forms.Framework.DeboggerObject=function(){
		return this.getInstance();
	};
	Forms.Framework.DeboggerObject.prototype={
			items:new Array(),
			terminated: false,
			resume:false,
			lbScript:null,
			getInstance: function () {
				if ( !instance ) {
					this.init();
					instance = this;
				}
				Forms.Framework.DeboggerObject.created=true;
				return instance;
			},
			init:function(){
				var self=this;
				Forms.Utils.addUniqueEvent($("btStepNext"), "click", function(){self.stepNext();});
				Forms.Utils.addUniqueEvent($("btExecute"), "click", function(){self.execute();});
				Forms.Utils.addUniqueEvent($("listExpressions"), "click", function(){
					var infoBulleId=$("listExpressions").value;
					if($(infoBulleId))
						Forms.InfoBulleUtils.showSelected($(infoBulleId), true);
				});
				Forms.Utils.addUniqueEvent($("hideFiltre"), "click",function(){hideFiltre=$("hideFiltre").checked;self.updateGui();});
				Forms.Utils.addUniqueEvent($("stopDebug"), "click",function(){stopDebug=$("stopDebug").checked;self.updateGui();});
				Forms.Utils.addUniqueEvent($("listExpressions"), "dblclick", function(){
					self.createScriptElement();
					Forms.Utils.fireEvent(this, "change");
				});
				this.createScriptElement();
				return this;
			},
			add:function(expression,caption,infoBulleId,exeExpression,breakPoint){
				jsExpression=new Forms.Framework.JsExpression(expression, caption, infoBulleId,breakPoint,exeExpression);
				this.items.push(jsExpression);
				this.terminated=false;
				addExpressionInGui(jsExpression);
				this.updateGui();
				if(this.resume || stopDebug)
					this.execute();
				return this;
			},
			addBreakPoint:function(expression,caption,infoBulleId,exeExpression){
				return this.add(expression,caption,infoBulleId,exeExpression,true);
			},
			execute:function(){
				if(!this.terminated || (this.resume && executionCounter<this.items.length)){
					do{
						this.resume=!this.items[executionCounter].isBreakPoint;
						this.items[executionCounter].script();
						this.updateOption(executionCounter);
						executionCounter++;
					}while(executionCounter<this.items.length && (!this.items[executionCounter].isBreakPoint || stopDebug));
					this.terminate();
				}
				this.updateGui();
				return this;
			},
			stepNext:function(){
				if(!this.terminated){
					this.items[executionCounter].script();
					this.updateOption(executionCounter);
					executionCounter++;
					if(executionCounter>=this.items.length){
						this.terminate();
					}
					this.updateGui();
				}
				return this;
			},
			terminate:function(){
				this.terminated=true;
				return this;
			},
			closeAndTerminate:function(){
				stopDebug=true;
				this.execute();
				return this;
			},
			updateGui:function(){
				Forms.Utils.show("divDebogger", true);
				var selectElement=$("listExpressions");
				if(selectElement){
					if(executionCounter<selectElement.length){
						selectElement.options[executionCounter].selected=true;
						Forms.Utils.fireEvent(selectElement, "change");
					}
				}
				$("btStepNext").disabled=this.terminated;
				$("btExecute").disabled=this.terminated;
				showFilter(!this.terminated && !hideFiltre);
				if(!this.terminated){
					Forms.Utils.addClass("btBreak", $("btStepNext"));
					Forms.Utils.rmClass("disabled", $("btStepNext"));
					Forms.Utils.rmClass("disabled", $("btExecute"));
				}
				else{
					Forms.Utils.rmClass("btBreak", $("btStepNext"));
					Forms.Utils.addClass("disabled", $("btStepNext"));
					Forms.Utils.addClass("disabled", $("btExecute"));
				}
				//Forms.Utils.fireEvent($("listScript"), "change");
			},
			updateOption:function(index){
				Forms.Utils.addClass("exeExpression", $("listExpressions").options[index]);
			},
			createScriptElement:function(){
				var elm=$("script");
				if(!elm){
					//Forms.DOM.addScript("http://127.0.0.1:8080/kotd5b/js/run_prettify.js?lang=css&skin=sunburst");
					var lb=Forms.Utils.lightBox("script","Scripts","");
					lb.modal=false;
					lb.addAction(undefined,'Fermer',function(){lb.hide();});
					lb.show();
					var pre=Forms.DOM.insertIn("textScript", $("script-boxContent"), "pre");
					//Forms.Utils.addClass("prettyprint linenums lang-css", pre);
					var list=$("listExpressions");
					var elements=this.items;
					Forms.Utils.addEventToElement(list, "change", function(){
						var str="";
						for(i in list.options){
							if(list.options[i].selected)
								str+=elements[i].exeExpression+"\n";
						}
						Forms.Utils.setInnerHTML("textScript", str);
						//prettyPrint();
					});
				this.lbScript=lb;
				}
				if(elm)
					Forms.Utils.show("script", true);
			}
		  };
})();
Forms.Framework.DeboggerObject.created=false;
(function(){
	Forms.Framework.FormForList=function(){
		
	};
	Forms.Framework.FormForList.prototype={
			lb:null,
			options:{},
			selectLine: null,
			selectStyle:{},
			ctrlString:{},
			msg:function(){
				setTimeout(this.clear, this.options['messageDelay']);
			},
			init:function(){
				var obj=this;
				this.selectLine=null;
				this.lb=new Forms.LightForm('idlb'+this.options['className'],this.options['title'],this.options['url'],'',this.options['ajaxDivMessageSubmit'],'',this.options['frmValidCaption'],this.options['frmCancelCaption']);
				this.lb.setModal(this.options['modal']);
				this.lb.object=this;
				var clear=function(){
					if($(obj.options['ajaxDivMessageSubmit'])!=null)
						$(obj.options['ajaxDivMessageSubmit']).innerHTML='';
					var refreshParams=_qs+obj.options['queryString']+"&_toToogle="+Forms.Framework.getToToogleValue();
					var nb='';
					if($('_nb')!=undefined) nb='_nb='+$$('_nb')+'&';
					refreshList=new Forms.Ajax(obj.options['ajaxDivContentRefresh'],obj.options['listContentUrl'],nb+'_refresh&_mode=1&'+refreshParams.replace('_mode=3',''));
					refreshList.get();
				};
				this.lb.postFormFunction=function(){setTimeout(clear, obj.options['messageDelay']);};
				this.lb.cancelFunction=function(){
					if(obj.selectLine!=null) 
						Forms.Utils.clearStyles(obj.selectLine,obj.selectStyle);
					return true;
					};
				this.lb.addValidator(this.options['controlOn'],this.ctrlString);
			},
			show:function(params,className,obj){
				this.selectLine=$(obj);
				if(this.options['isEdit']==false)
					params='_refresh&_insertMode=1&_mode=2&_cls='+className+'&_idForm='+this.options['idForm']+'&'+this.options['queryString'];
				else{
					if (params=='') params='_refresh&_insertMode=0&_mode=2&_cls='+className+'&_idForm='+this.options['idForm']+'&'+this.options['queryString'];
					else params+='&_insertMode=0&_mode=2&_cls='+className+'&_idForm='+this.options['idForm']+'&'+this.options['queryString'];
				}
				this.lb.urlResponse=this.options['messageAndUpdateURL']+'?_refresh&_mode=3&'+params.replace('_mode=2','');
				this.lb.frmName=this.options['idForm'];
				this.lb.setParams(params);
				if(this.selectLine!=null) Forms.Utils.setStyles(this.selectLine,this.selectStyle);
				this.lb.show();
			}

	};
})();
(function(){
	Forms.Elements=function(selector, context){
		if(!context)
			context=document;
		this.selector=selector;
		this.context=context;
		if(selector=="window")
			this.values=[window];
		else if(selector=="body" || selector=="#")
				this.values=[window.document.body];
		else if(selector=="document")
			this.values=[window.document];
		else
			this.values=Sizzle(selector,context);
		return this;
	};
	Forms.Elements.prototype={
			selector:"",
			context: document,
			values: {},
			itemIndex:-1,
			each: function(callback,args){
				Forms.Utils.each(this.values, callback, args);
				return this;
			},
			get: function(index){
				return index == null ?
						this.values:
				index < 0 ? this.values[this.length + index ] : this.values[index];
			},
			getFirst:function(){
				return this.get(0);
			},
			getLast:function(){
				return this.get(this.length-1);
			},
			length:function(){
				return this.values.length;
			},
			addEvent:function(event,func,before,keyCode){
				values=this.values;
				for(var i=0;i<values.length;i++){
					Forms.Utils.addEventToElement(values[i], event, func, before, keyCode);
				}
				return this;
			},
			addUniqueEvent:function(event,func,before,keyCode){
				values=this.values;
				for(var i=0;i<values.length;i++){
					Forms.Utils.addUniqueEvent(values[i], event, func, before, keyCode);
				}
				return this;
			},
			attr:function(attr,newValue){
				values=this.values;
				for(var i=0;i<values.length;i++){
					values[i][attr]=newValue;
				}
				return this;
			},
			html:function(html){
				values=this.values;
				for(var i=0;i<values.length;i++){
					Forms.Utils.setInnerHTML(values[i], html);
				}
				return this;
			},
			css:function(styles){
				values=this.values;
				for(var i=0;i<values.length;i++){
					Forms.Utils.setStyles(values[i], styles);
				}
				return this;
			},
			toArray:function(){
				return $A(this.values);
			},
			show: function(method){
				Forms.Utils.showElements(this.values, method);
				return this;
			},
			previous:function(){
				if(this.itemIndex==0 || this.itemIndex==-1){
					this.itemIndex=this.values.length-1;
				}else
					this.itemIndex--;
				return this.current();
			},
			next:function(){
				if(this.itemIndex<this.values.length-1)
					this.itemIndex++;
				else
					this.itemIndex=0;
				return this.current();
			},
			current:function(){
				if(this.itemIndex>-1 && this.itemIndex<this.values.length)
					return this.values[this.itemIndex];
			},
			selectById:function(id){
				for(var i=0;i<this.values.length;i++){
					if(this.values[i].id==id){
						this.itemIndex=i;
						return;
					}
				}
			}
	};
})();
//----------------------------------------------------------------------------------------------------------
$=Forms.Utils.$;
$$=Forms.Utils.$$;
$addEvt=Forms.Utils.addEventToElement;
$addUEvt=Forms.Utils.addUniqueEvent;
$addEvts=Forms.Utils.addEventToElements;
$addEvtByTN=Forms.Utils.addEvent;
$addEvtByCN=Forms.Utils.addEventByCN;
$set=Forms.Utils.setInnerHTML;
$get=Forms.Utils.get;
$getWR=Forms.Utils.getWR;
$post=Forms.Utils.post;
$postWR=Forms.Utils.postWR;
$postForm=Forms.Utils.postForm;
$postFormWR=Forms.Utils.postFormWR;
$getForm=Forms.Utils.getForm;
$getFormWR=Forms.Utils.getFormWR;
$selector=Forms.Selector;
$qs=Forms.Utils.thisQueryString;
$adsl=Forms.Utils.addslashes;
$getValues=Forms.Utils.getValues;
$infoBulle=Forms.Framework.infoBulle;
$debogger=Forms.Framework.DeboggerObject;
show=Forms.Utils.show;
Ajx=Forms.Ajax;
$gte=Forms.DOM.getTargetEvent;
$gkc=Forms.DOM.getKeyCode;
$sp=Forms.Utils.stopPropagation;
$vId=Forms.Utils.valueFromId;
$num=Forms.Utils.num;
$e=Forms.Elements;
_message=null;
_ER=null;
requests=new Array();