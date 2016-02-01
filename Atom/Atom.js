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
	loadMainFile();
	readMainFile();
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
			description:propString[4],
			authors:propString[5]
		}
		delete mods[i].propertyString;
		log("Finished Reading "+i+"/"+mods.length+".");
	}
	log("Finished Reading Properties.");
}

function loadMainFile(){
	log("Loading Main Files.");
	for(var i = 0; i<mods.length; i++){
		log("Loading "+i+"/"+mods.length+".");
		var mainFile = file(mods[i].variables.mainFilePath.toString());
		if(mainFile.exists()){
			var fos = new java.io.FileInputStream(mainFile);
			var str = new java.lang.StringBuilder(); 
			var ch;
			while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
			mods[i] = {
				mainFileString:str.toString()
			}
			fos.close();
			log("Finished Loading "+i+"/"+mods.length+".");
		}else{
			log(i+" isn't a file!");
			delete mods[i];
		}
	}
	log("Finished Loading Main Files.");
}

//This Is Atoms Brain
function readMainFile(){
	log("Reading Main Files.");
	atom.setItem(256,dahra,Test,apple,0,"Atom");
	log("Finished Reading Main Files.");
}

//Atoms Functions
atom.setItem = function(itemId,id,name,tex,texDat,modId){
	log("Created Item: itemId: "+itemId+", id: "+id+", ModId: "+modId+".");
	ModPE.setItem(itemId,tex,texDat,name);
	Player.addItemCreativeInv(itemId, 0, 1);
}