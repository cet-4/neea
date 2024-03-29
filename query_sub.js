var query_util = new Object();

query_util.results_url = "http://cjcx.neea.edu.cn/html1/folder/1508/206-1.htm";
query_util.certi_url = "http://zscx.neea.edu.cn/html1/folder/1508/211-1.htm";

query_util.getSubsTab = function(data){
	var tabStr = "";
	if(data.length>0){
		tabStr = "<table class='sub_tab' width='100%' border='0'>";
		
		var isOdd = data.length%2 != 0;//是否是奇数
		for(var i=0;i<data.length;i++){
			var item = data[i];
			var name = item.name;
			var stoptest_state = item.stoptest_state?item.stoptest_state:0;
			var target = item.target;
			var query_url = item.query_url;
			
			if(i%2 == 0){//列1
				tabStr+="<tr>";
			}
			tabStr+="<td"+(stoptest_state==1?" class='sub_stoptest'":"")+"><span>";
			tabStr+="<a href='"+query_url+"' target='"+target+"' title='"+name+"'>"+name+"</a>";
			tabStr+="</span></td>";
			if(i%2 != 0 || (isOdd&&(i==data.length-1)) ){//列2
				tabStr+="</tr>";
			}
		}
		tabStr += "</table>";
	}
	return tabStr;
};
query_util.putQuerySubsInfo=function(dcSubList,subList){
	var str = "";
	if(dcSubList&&dcSubList.length>0){//最新查询
		str+="<div class='sub_tit'>最新查询</div>";
		str+="<div class='sub sub1'>";
		var dcSubTab = query_util.getSubsTab(dcSubList);
		str+=dcSubTab;
		str+="</div>";
	}
	if(subList&&subList.length>0){//选择考试项目
		str+="<div class='sub_tit' style='margin-top:30px'>选择考试项目</div>";
		str+="<div class='sub sub2'>";
		var resultsSubTab = query_util.getSubsTab(subList);
		str+=resultsSubTab;
		str+="</div>";
		str+="<div class='sub_stoptest_tip'>注：灰色字体为已停考项目</div>";
	}
	get("queryLeft").innerHTML += str;
};

query_util.putCjcxQuerySubsInfo=function(){
	query_util.putQuerySubsInfo(dc_results_subject_list,results_subject_list);
};

query_util.putZscxQuerySubsInfo=function(){
	query_util.putQuerySubsInfo(dc_certi_subject_list,certi_subject_list);
};

query_util.getDcSubLink=function(subType,subCode,sid){//subType:results或certi
	var urlName = subType+"_url";
	var linkUrl = query_util[urlName]+"?sid="+sid;
	var arr = window["dc_"+subType+"_subject_list"];
	for(var i in arr){
		var sub = arr[i];
		if(sub.code==subCode){
			linkUrl = sub.query_url;
			break;
		}
	}
	return linkUrl;
};

query_util.putIndexDcQuerySubsInfo=function(){
	var cetCjcxLinkUrl = query_util.getDcSubLink("results","CET","1");
	var petsCjcxLinkUrl = query_util.getDcSubLink("results","PETS","280");
	var ncreCjcxLinkUrl = query_util.getDcSubLink("results","NCRE","300");
	
	var ncreZscxLinkUrl = query_util.getDcSubLink("certi","NCRE","300");
	
	get("results_CET").href = cetCjcxLinkUrl;
	get("results_PETS").href = petsCjcxLinkUrl;
	get("results_NCRE").href = ncreCjcxLinkUrl;
	
	get("certi_NCRE").href = ncreZscxLinkUrl;
};

query_util.putDcQuerySubsInfo=function(subType,subCode,sid){
	var linkUrl = query_util.getDcSubLink(subType,subCode,sid);
	get(subType+"_"+subCode).href = linkUrl;
};



function get(id){return document.getElementById(id);}
