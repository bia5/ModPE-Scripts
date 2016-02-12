//Mod By CrazyWolfy23
//Get Updates at http://crazywolfy23.github/io/minecraft/SurvivalPE/

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

/*
TODO
===============
-Rework Pipes
-GUI
*/

/*
Latest Update
================
-Rewrote Mod
*/

var version = "0.1.8";
var blockPos;

var SurvivalPE = {
	multiblockGen:{
		boiler:{},
		steamConverter:{}
	},
	generators:{
		coal:{},
		lava:{},
		gunpowder:{},
		solar:{},
		steam:{}
	},
	machines:{
		electicFurnace:{}
	},
	pipes:{
		steam:{},
		energy:{}
	},
	storage:{
		liquid:{},
		energy:{}
	}
}
var id = {
	block:{
		boiler:33,
		steamConverter:34,
		coalGen:36,
		lavaGen:43,
		gunpowderGen:54,
		solarGen:55,
		steamGen:69,
		electicFurnace:70,
		pipe1:71,
		pipe2:72,
		pipe3:74,
		pipe4:75,
		liquidStorage:76,
		energyStorage:77
	},
	item:{
		pipeSteam:500,
		pipeSteamExtraction:501,
		pipeEnergy:502,
		pipeEnergyExtraction:503,
		wrenchBlue:504,
		wrenchRed:505
	}
}

ModPE.setItem(id.item.pipeSteam,"pipe_steam",0,"Steam Pipe");
ModPE.setItem(id.item.pipeSteamExtraction,"pipe_steam_extraction",0,"Steam Extraction Pipe");
ModPE.setItem(id.item.pipeEnergy,"pipe_energy",0,"Energy Pipe");
ModPE.setItem(id.item.pipeEnergyExtraction,"pipe_energy_extraction",0,"Energy Extraction Pipe");
ModPE.setItem(id.item.wrenchBlue,"wrench_blue",0,"Blue Wrench");
ModPE.setItem(id.item.wrenchRed,"wrench_red",0,"Red Wrench");

Block.defineBlock(id.block.boiler,"Steam Boiler",[
["machine_bottom",0],["steam_boiler_top",0],["steam_boiler_front",0],["steam_boiler_side",0],["steam_boiler_side",0],["steam_boiler_side",0],
["machine_bottom",0],["steam_boiler_top",0],["steam_boiler_side",0],["steam_boiler_front",0],["steam_boiler_side",0],["steam_boiler_side",0],
["machine_bottom",0],["steam_boiler_top",0],["steam_boiler_side",0],["steam_boiler_side",0],["steam_boiler_front",0],["steam_boiler_side",0],
["machine_bottom",0],["steam_boiler_top",0],["steam_boiler_side",0],["steam_boiler_side",0],["steam_boiler_side",0],["steam_boiler_front",0]
]);
Block.defineBlock(id.block.steamConverter,"Steam Converter",[]);
Block.defineBlock(id.block.coalGen,"Coal Generator",[]);
Block.defineBlock(id.block.lavaGen,"Lave Generator",[]);
Block.defineBlock(id.block.gunpowderGen,"Gunpowder Generator",[]);
Block.defineBlock(id.block.solarGen,"Solar Generator",[]);
Block.defineBlock(id.block.steamGen,"Steam Generator",[]);
Block.defineBlock(id.block.electicFurnace,"Electric Furnace",[]);
Block.defineBlock(id.block.pipe1,"pipe1",[],7,false,0);
Block.defineBlock(id.block.pipe2,"pipe2",[],7,false,0);
Block.defineBlock(id.block.pipe3,"pipe3",[],7,false,0);
Block.defineBlock(id.block.pipe4,"pipe4",[],7,false,0);
Block.defineBlock(id.block.liquidStorage,"Tank",[]);
Block.defineBlock(id.block.energyStorage,"Spin Wheel",[]);

Block.setShape(id.block.pipe1,0.25,0.25,0.25,0.75,0.75,0.75);
Block.setShape(id.block.pipe2,-0.25,0.25,0.25,1.25,0.75,0.75);
Block.setShape(id.block.pipe3,0.25,0.25,-0.25,0.75,0.75,1.25);
Block.setShape(id.block.pipe4,0.25,-0.25,0.25,0.75,1.25,0.75);

function newLevel(){
	loadVariables();
	clientMessage("SurvivalPE v"+version+" is made by CrazyWoolfy23");
	log("Running SurvivalPE v"+version);
}

function leaveGame(){
	saveVariables();
}

function useItem(x,y,z,itemId,blockId,side,itemDmg,blockDmg){
	blockPos = getTrueXYZ(x,y,z,side);
}

function destroyBlock(x,y,z,side){}
function modTick(){}

function getTrueXYZ(x,y,z,side){
	if(side == 0){y = y - 1;}
	else if(side == 1){y = y + 1;}
	else if(side == 2){z = z - 1;}
	else if(side == 3){z = z + 1;}
	else if(side == 4){x = x - 1;}
	else if(side == 5){x = x + 1;}
	return [x,y,z];
}

function log(string){
	java.io.File(new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE")).mkdirs();
	var logFile = new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/log.txt");
	if(!logFile.exists()) java.io.File(new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/log.txt")).createNewFile();
	if(logFile.exists()){
		var out = new java.io.PrintWriter(new java.io.FileWriter(logFile, true));
		out.println("[SurvivalPE] "+string);
		out.close();
	}
}

loadVariables=function(){
	java.io.File(new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE")).mkdirs();
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Variables.txt");
	if(!data.exists()) return false; data.createNewFile();
	var fos=new java.io.FileInputStream(data);
	var str=new java.lang.StringBuilder(); var ch;
	while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
	SurvivalPE=JSON.parse(String(str.toString())); fos.close();
}

saveVariables=function(){
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Variables.txt");
	if(data.exists()) data.delete(); data.createNewFile();
	var outWrite=new java.io.OutputStreamWriter(new java.io.FileOutputStream(data));
	outWrite.append(JSON.stringify(machines)); outWrite.close();
	SurvivalPE={};
}