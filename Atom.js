//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

var version = "0.1.0";
var stage = stage_02;
var stage_01 = "RUNNING";
var stage_02 = "READY";
var stage_03 = "PAUSED";
var stage_04 = "LOADING ATOM v"+version;
var stage_05 = "LOADING MODS";
var stage_06 = "LOADING PROPERTIES";
var stage_07 = "READING PROPERTIES";
var stage_08 = "LOADING PREINIT";
var stage_09 = "READING PREINIT";
var stage_10 = "LOADING INIT";
var stage_11 = "READING INIT";
var stage_12 = "lOADING POSTINIT";
var stage_13 = "READING POSTINIT";
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
	log("Finished Loading Mods");
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
			
		}
	}
}
function readPreInit(){}
function readInit(){}
function readPostInit(){}

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
		out.println("[Atom]"+string);
		out.close();
	}
}
function file(string){
	return new java.io.File(string);
}
