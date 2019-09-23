
function checkReg(obj){
	document.getElementById('tip_'+obj).style.display='block';
}

function checkRegOut(obj,test){
	if(document.getElementById(obj).value==''){
		document.getElementById('tip_'+obj).innerHTML='<b style="color:red;">'+test+'</b>';
	}else{
		document.getElementById('tip_'+obj).style.display='none';
	}
}

function show(obj){
	document.getElementById(obj).src='{% url "app:yzm" %}?math='+Math.random();
}

