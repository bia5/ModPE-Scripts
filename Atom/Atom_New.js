//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

/*
Contributers
================
-CrazyWolfy23:
	-Founder
	-Owner
	-Project Leader

-Khristian_Kun (RedstoneGunMade):
	-Spanish Translator
*/

/*
Latest Version
================
-Rewrote Mod, should work better.
-Will Add Spanish Tanslations Soon! Thanks Khristian_Kun (RedstoneGunMade).
*/

var version = "0.1.2";
var mcpeVersion = "0.14.0";
var hasLoaded = false;
var shouldCheckVersions = true;
var modFolders = [];
var mods = {};
var atomFolder = file(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftpe/Atom/");
var modsFolder = file(atomFolder.getPath()+"/mods/");
var logFile = file(atomFolder.getPath()+"/log.txt");

function newLevel(){
	fileChecker();
	log("Hello");
	loadAtom();
}

function leaveGame(){
	if(!hasLoaded){
		hasLoaded = false;
	}
	log("Goodbye");
}

function modTick(){
	if(hasLoaded){}
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

function loadAtom(){
	log("Loading Atom v"+version+".");
	log("This Atom Version Should Support MCPE: "+mcpeVersion+".");
	modFolders = modsFolder.listFiles();
	loadProperties();
	readProperties();
	makeVariables();
	loadMainFiles();
	log("Finished Loading Atom.");
}

function loadProperties(){
	log("Loading Properties.");
	var notMods = [];
	for(var i = 0; i<modFolders.length; i++){
		var propFile = file(modFolders[i].toString()+"/properties.txt");
		if(propFile.exists()){
			var fos = new java.io.FileInputStream(propFile);
			var str = new java.lang.StringBuilder(); 
			var ch;
			while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
			mods[i] = {
				tempPropStr:str.toString()
			}
			fos.close();
		}else{
			notMods.push(i);
		}
	}
	for(var i = 0; i<notMods.length; i++){
		delete modFolders[parseInt(notMods[i])];
	}
	delete notMods;
	delete modFolders
	log("Finished Loading Properties.");
}

function readProperties(){
	log("Reading Properties.");
	var stops = [];
	for(var i = 0; <mods.length; i++){
		var propString = mods[i].propString.split("\n");
		if(shouldCheckVersions){
			if(version == propString[4] && mcpeVersion == propString[5]){
				mods[i].properties = {
					name:propString[0],
					package:propString[1],
					mainFile:propString[2],
					version:propString[3],
					atomVersion:propString[4],
					mcpeVersion:propString[5],
					description:propString[6],
					authors:propString[7]
				}
			}
			else{
				stops.push(i);
			}
		}
		else{
			mods[i].properties = {
				name:propString[0],
				package:propString[1],
				mainFile:propString[2],
				version:propString[3],
				atomVersion:propString[4],
				mcpeVersion:propString[5],
				description:propString[6],
				authors:propString[7]
			}
		}
		delete mods[i].propString;
	}
	for(var i = 0; i<stops.length; i++){
		delete mods[parseInt(stops[i])];
	}
	log("Finished Reading Properties.");
}

function makeVariables(){
	log("Loading Variables.");
	for(var i = 0; i<mods.length; i++){
		mods[i].variables = {
			vars:{},
			ids:{},
			ifs:{}
		}
	}
	log("Finished Loading Variables.");
}

function loadMainFiles(){
	log("Loading Main Files.");
	for(var i = 0; i<mods.length; i++){
		readAtomFile(mods[i].properties.mainFile,i);
	}
	log("Finished Loading Main Files.");
}

function readAtomFile(string,nmb){
	log("Reading Atom File At: "+string+".");
	var tempFile = file(string);
	if(tempFile.exists()){
		var fos=new java.io.FileInputStream(tempFile);
		var str=new java.lang.StringBuilder();
		var ch;
		while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
		fos.close();
		var s_1 = str.split("\n");
		for(var i = 0; i<s_1.length; i++){
			readAtomLine(s_1,0,nmb);
		}
		for(var i = 0; i<s_1.length; i++){
			readAtomLine(s_1,1,nmb);
		}
		for(var i = 0; i<s_1.length; i++){
			readAtomLine(s_1,2,nmb);
		}
	}
	log("Finished Reading Atom File At: "+string+".");
}

function readAtomLine(string,i_1,i){
	log("Reading Atom Line: "+string+".");
	var s_1 = string.split("//");
	var s_2 = s_1[0].split(";");
	var s_3 = s_2[0].split(":");
	var s_4 = s_2[0].split("(");
	var s_5 = s_4[1].split(")");
	var s_6 = s_5[0].split(",");
	if(i_1 == 0){
		if(s_3[0] == "bool"){
			mkNewVar(i,"bool",s_3[1],s_3[2]);
		}
		if(s_3[0] == "int"){
			mkNewVar(i,"int",s_3[1],s_3[2]);
		}
		if(s_3[0] == "string"){
			mkNewVar(i,"string",s_3[1],s_3[2]);
		}
		if(s_3[0] == "file"){
			mkNewVar(i,"file",s_3[1],s_3[2]);
		}
		if(s_3[0] == "delete"){
			if(mods[i].variables.vars[s_3[1]].exists()){
				delete mods[i].variables.vars[s_3[1]];
			}
		}
	}
	if(i_1 == 1){
		if(s_3[0] == "if"){
			var temp_s_1 = s_3[1]
			if(temp_s_1.indexOf("=")){
				var temp_s_2 = s_3[1].split("==");
				if(getBool(temp_s_2[0],i)==getBool(temp_s_2[1],i)){
					readAtomLine(s_3[2]+";",2,i);
				}
				delete temp_s_2;
			}
			if(temp_s_1.indexOf("!=")){
				var temp_s_2 = s_3[1].split("!=");
				if(getBool(temp_s_2[0],i)!=getBool(temp_s_2[1],i)){
					readAtomLine(s_3[2]+";",2,i);
				}
				delete temp_s_2;
			}
			delete temp_s_1;
		}
	}
	if(i_1 == 2){	//Run Code
		if(s_4[0] == "say"){
			say(s_5[0]);
		}
	}
	log("Finished Reading Atom Line: "+string+".");
}

function getBool(bool,i){
	if(mods[i].variables.vars[bool]){
		if(mods[i].variables.vars[bool].type == "bool"){
			if(mods[i].variables.vars[bool].value == "true"){
				return true;
			}
			if(mods[i].variables.vars[bool].value == "false"){
				return false;
			}
		}
	}
	else if(bool == "true"){
		return true;
	}
	else if(bool == "false"){
		return false;
	}
	return null;
}

function mkNewVar(i_1,s_1,s_2,s_3){
	mods[i_1].variables.vars[s_2] = {
		type:s_1,
		name:s_2,
		value:s_3
	}
}

function readLineInFile(s_1,i_1){
	var tempFile = file(s_1);
	if(tempFile.exists()){
		var fos = new java.io.FileInputStream(tempFile);
		var str = fos.readLine(i_1).toString();
		fos.close();
		return str;
	}
	return "Error";
}