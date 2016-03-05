//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

var version = "0.1.1";
var mc-version = "0.13.1";
var hasLoaded = false;
var modFolders = [];
var mods = [];
var atom = {};
var atomFolder = file(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftpe/Atom/");
var modsFolder = file(atomFolder.getPath()+"/mods/");
var logFile = file(atomFolder.getPath()+"/log.txt");

function  newLevel(){
	fileChecker();
	log("Hello");
	loadMods();
}
function leaveGame(){
	if(hasLoaded == true){
		hasLoaded = false;
	}
	log("Goodbye");
}
function modTick(){
	if(hasLoaded == true){}
}

function fileChecker(){
	if(!atomFolder.exists()){
		atomFolder.mkdirs();
	}
	if(!modsFolder.exists()){
		modsFolder.mkdirs();
	}
	if(!logFile.exists()){
		logFile.createNewFile();
	}
}

function log(string){
	if(logFile.exists()){
		var out = new java.io.PrintWriter(new java.io.FileWriter(logFile, true));
		out.println("[Atom] "+string);
		out.close();
	}
}

function file(string){
	return new java.io.File(string);
}

function loadMods(){
	log("Loading Atom v"+version);
	modFolders = modsFolder.listFiles();
	loadProperties();
	readProperties();
	makeModVars();
	runMainFiles();
	hasLoaded = true;
	log("Finished Loading Mods");
	log("Running all "+mods.length+" mods.");
}
function loadProperties(){
	var whyz = 0;
	log("Loading Properties.");
	for(var i = 0; i<modFolders.length; i++){
		log("Loading "+i+"/"+modFolders.length+".");
		var prop = file(modFolders[i].toString()+"/properties.txt");
		if(prop.exists()){
			var fos = new java.io.FileInputStream(prop);
			var str = new java.lang.StringBuilder(); 
			var ch;
			while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
			mods[mods.length-whyz] = {
				propertyString:str.toString()
			}
			fos.close();
			log("Finished Loading "+i+"/"+modFolders.length+".");
		}else{
			whyz++;
			log(i+" isn't a file!");
			delete modFolders[i];
		}
	}
	log("Finished Loading Properties.");
}

function readProperties(){
	log("Reading Properties.");
	for(var i = 0; i<mods.length; i++){
		log("Reading "+i+"/"+mods.length+".");
		var propString = mods[i].propertyString.toString().split("\n");
		mods[i].variables = {
			id:propString[0],
			name:propString[1],
			mainFilePath:propString[2],
			version:propString[3],
			mcversion:propString[4],
			description:propString[5],
			authors:propString[6]
		}
		delete mods[i].propertyString;
		log("Finished Reading "+i+"/"+mods.length+".");
	}
	log("Finished Reading Properties.");
}

function makeModVars(){
	log("Making Mod Variables.");
	for(var i = 0; i<mods.length; i++){
		if(mods[i].modVariables){
			mods[i].modVariables = {
				functions:[],
				variables:[],
				ids:[]
			}
		}
	}
	log("Finished Making Mod Variables.");
}

function runMainFiles(){
	log("Running Main Files.");
	for(var i = 0; i<mods.length; i++){
		readAtomFile(mods[i].variables.mainFilePath,i);
	}
	log("Finished Running Main Files.");
}

function readAtomFile(string,mId){
	log("Reading Atom File.");
	var atomFile = file(string);
		var fos=new java.io.FileInputStream(atomFile);
		var str=new java.lang.StringBuilder();
		var ch;
		while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
		fos.close();
		var s_1 = str.split("\n");
		for(var i = 0; i<s_1.length; i++){
			readFunctionLine(s_1[i],mId);
		}
	log("Finished Reading Atom File.");
}

function readFunctionLine(string,mId){
	log("Reading Function Line.");
	var s_1 = string.split(":");
	var s_2 = s_1[0].split(".");
	var s_3 = s_1[1].split(",");
	if(s_2[0] == ("atom")){
		if(s_2[1] == ("setItem")){
			var v_1 = parseInt(s_3[0]);
			var v_2 = s_3[1];
			var v_3 = s_3[2];
			var v_4 = s_3[3];
			var v_5 = parseInt(s_3[4]);
			var v_6 = s_3[5].replace(";","");
			atom.setItem(v_1,v_2,v_3,v_4,v_5,mId);
		}
	}
	else if(s_2[0] == "fileManager"){
		if(s_2[1] == "makeNewFile"){
			var v_1 = s_3[0];
			fileManager.makeNewFile(v_1);
		}
		if(s_2[1] == "makeNewDir"){
			var v_1 = s_3[0];
			fileManager.makeNewDir(v_1);
		}
	}
	else if(s_1[0] == "if"){
		var s_4 = s_1[1].split("=");
		if(isBool(s_4[0]) && isBool(s_4[1])){
			if(checkIfBoolsEquals(s_4[0],s_4[1])){}
			else{}
		}
	}
	log("Finished Reading Function Line.");
}

function isBool(b_1){}
function checkIfBoolsEquals(b_1,b_2){}

//Atoms Functions
atom.setItem = function(itemId,id,name,tex,texDat,mId){
	ModPE.setItem(itemId,tex,texDat,name);
	Player.addItemCreativeInv(itemId, 0, 1);
	mods[mId].modVariables.itemIds.push([id,itemId]);
}
atom.addItem = function(id,name,tex,texDat,mId){}
fileManager.makeNewFile(string){
	var f_1 = file(string);
	if(!f_1.exists()){
		f_1.createNewFile();
	}
}
fileManager.makeNewDir(string){
	var f_1 = file(string);
	if(!f_1.exists()){
		f_1.mkdirs;
	}
}