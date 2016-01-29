//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

var version = "0.1.0";
var hasLoaded = false;
var modFolders = [];
var mods = [];
var atomFolder = file(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftpe/Atom/");
var modsFolder = file(atomFolder.getPath()+"/mods/");
var logFile = file(modsFolder.getPath()+"/log.txt");

function  newLevel(){
	fileChecker();
	log("Hello");
	loadMods();
}
function leaveGame(){
	log("Goodbye");
}
function modTick(){}

function loadMods(){
	log("Loading Atom v"+version);
	modFolders = modsFolder.listFiles();
	loadProperties();
	readProperties();
	preInit();
	init();
	postInit();
	hasLoaded = true;
	log("Finished Loading Mods");
	log("Running all "+mods.length+" mods.");
}
function loadProperties(){
	for(var i = 0; i<modFolders.length; i++){
		var prop = file(modFolders[i].toString()+"/properties.txt");
		if(prop.exists()){
			var fos = new java.io.FileInputStream(data);
			var str = new java.lang.StringBuilder(); 
			var ch;
			while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
			mods[mods.length].propertyString = String(str.toString());
			fos.close();
		}else{
			delete modFolders[i];
		}
	}
}
function preInit(){}
function init(){}
function postInit(){}

function readProperties(){
	for(var i = 0; i<mods.length; i++){
		var propString = mods[i].propertyString.toString().split("/n");
		for(var j = 0; j<propString.length; j++){
			mods[i].variables = {
				id:propString[0],
				name:propString[1],
				mainFilePath:propString[2],
				version:propString[3],
				description:propString[4],
				authors:propString[5]
			}
		}
	}
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
