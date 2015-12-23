define(['store','chemwriter'], function(store,chemwriter){
/*
	结构图画板
	对原来的chemwriter进行扩展
*/

	//清除浏览器中保存的结构数据
	chemwriter.clear_molfile=function(mid){
		mid=mid||"molfile";
		store.remove(mid);
	};

	//保存结构mol数据到浏览器
	chemwriter.save_molfile=function(molfile){
		if(molfile && molfile.length > 0){
			molfile = molfile.replace(/\r?\n/g, "|");
		}
		store.set('molfile',molfile);
	};

	//从浏览器读取mol数据
	chemwriter.load_molfile=function(mid){
		mid=mid||"molfile";
		var molfile,
			molfile_item = document.getElementById(mid);

		if(molfile_item && molfile_item.value.length > 0){
			molfile = molfile_item.value;
		}else{
			molfile = store.get('molfile');
		}

		if(molfile && molfile.length > 0){
			molfile = molfile.replace(/\|/g, "\n");
		}
		return molfile;
	};

	return chemwriter;
});