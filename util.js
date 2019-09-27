var util = new Object();

util.initFunc=function(){
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s*|\s*$/g, "");
		}
	}
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
};
util.initFunc();

/****** 工具类方法 ---  start ******/

/******根据条件查询实体类对象或list ---  start ******/
/**
 * 根据key查询json对象
 */
util.findObjByKey=function(list,key,val){
	var obj;
	var option={};
	option[key] = val;
	var nl = util.findList(list,option);
	if(nl&&nl.length>0){
		obj = nl[0];
	}
	return obj;
};
/**
 * 通过条件查询获取json list
 * @param ol 原json list
 * @param pram_option 条件【json对象】
 * @returns 新json list
 */
util.findList=function(ol,pram_option){
	var nl=[];
	if(ol&&pram_option){
		for ( var i=0; i<ol.length; i++) {
			var obj = ol[i];
			var flag = util.checkObj(obj,pram_option);
			if(flag){
				nl.push(obj);
			}
		}
	}
	return nl;
};
/**
 * 验证json对象是否符合条件
 * @param obj json对象
 * @param pram_option 条件【json对象】
 * @returns boolean flag
 */
util.checkObj=function(obj,pram_option){
	var flag = true;
	for(var key in pram_option){
		if(obj[key]!=pram_option[key]){
			flag = false;
			break;
		}
	}
	return flag;
};
/******根据条件查询实体类对象或list ---  end ******/

/**
 * 验证是否是数字
 * return 是否为数字
 */
util.checkNum=function(n){
	var f = false;
	if(n != null && n != "" && !isNaN(n) && n.trim().length != 0){
		var pattern = new RegExp("^[0-9]*$");
		f = pattern.test(n);
	}
	return f;
};

util.checkString=function(s) {
	if(!s)
		return true;
	//var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
	//var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
	//var reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/?~！@#￥……&*—|{}【】‘；：”“'。，、？]");
	var reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/！@#￥……&*—|{}【】‘；：”“'。，、]");
    return reg.test(s);
};

/**
 * 检查是否有空格
 */
util.checkSpace=function(s) {
	var f = true;
	if(s.indexOf(" ")==-1&&s.indexOf("　")==-1){
		f = false;
	}
	return f;
};

/**
 * 去空格
 */
util.trim=function(str)
{
    for(var  i  =  0  ;  i<str.length  &&  str.charAt(i)==" "  ;  i++  )  ;
    for(var  j  =str.length;  j>0  &&  str.charAt(j-1)==" "  ;  j--)  ;
    if(i>j)  return  "";  
    return  str.substring(i,j);
};

util.get=function(id){return document.getElementById(id);};

/**
 * 校验cet的准考证号是否错误
 * return 是否错误
 */
util.checkCetZkzh=function(z){
	var f = false;
	if(!z){
		f = true;
	}else{
		var t = z.charAt(0);
		if(t!="F"&&t!="S"){
			if(!util.checkNum(z))f = true;
			else{
				var t = z.charAt(9);
				if(isNaN(t))f = true;
			}
		}else{
			if(!util.checkNum(z.substring(1)))f = true;
		}
	}
	return f;
};

util.checkTime = function(startTime){
	var startDate = new Date(startTime);
	var t = startDate.getTime();
	var d=new Date().getTime();
	if(d>=t){
		return "";
	}
	return "对不起，请于"+util.showtime(startDate)+"再来查询！";
};

util.showtime=function(d) {
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var timeValue = d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日"+((hours >= 12)?"下午":"上午");
    timeValue += ((hours >12) ? hours -12 :hours);
    timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
    return timeValue;
};

util.nec=function(ca,e,daz,dax,das){
	var tjUrl = "http://tj.neea.edu.cn";
	if(result && result.tjUrl){
		tjUrl = result.tjUrl;
	}
	var p = [];
	p.push("ca="+ca);
	p.push("e="+e);
	if(daz){
		p.push("daz="+daz);
		p.push("dax="+dax);
		p.push("das="+das);
	}
	var h = tjUrl+"/tj.gif?"+p.join("&")+"&t="+(+new Date);
	util.nec_load(h);
};

util.nec_load=function(a){
	var e = new Image;
	e.onload = e.onerror = e.onabort = function() {
		e.onload = e.onerror = e.onabort = null;
		e = null;
	};
	e.src = a;
};

util.urlLoad=function(a,f){
	var head = document.getElementsByTagName('head')[0];
	var nea = document.createElement("script");
	nea.type = "text/javascript";
	nea.src = a;
	head.appendChild(nea);
	nea.onload = nea.onreadystatechange = function() {
		if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
			nea.onload = nea.onreadystatechange = null;
			if (head && nea.parentNode ) {
				if(f)
					f(false);
				head.removeChild(nea);
			}
		}
	};
	nea.onerror = function() {
		if(f)
			f(true);
	};
};

/** cet获取考次名称和考试级别名称 start **/
util.cetZzkzhRule = ["","CET4-D","CET6-D","CJT4-D","CJT6-D","PHS4-D","PHS6-D","CRT4-D","CRT6-D","TFU4-D"];
util.getCetKsxm=function(z){
	z = z+"";
	var idx = -1;
	var t = z.charAt(0);
	if(t=="F"){
		idx = 1;
	}else if(t=="S"){
		idx = 2;
	}else{
		t = z.charAt(9);
		if(!isNaN(t))
			idx = t;
	}
	if(idx!=-1){
		var code = util.cetZzkzhRule[idx];
		if(window.dq){
			return util.findObjByKey(dq.rdsub,"code",code);
		}
	}
	return null;
};
util.getCetName=function(){
	if(window.dq){
		return dq.sn;
	}
	return null;
};
util.getCetJb=function (z){
	var jb = null;
	var obj = util.getCetKsxm(z);
	if(obj){
		jb = obj.name;
	}
	return jb;
}
/** cet获取考次名称和考试级别名称 end **/
