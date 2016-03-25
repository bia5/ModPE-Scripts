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
-Textures
*/

/*
Latest Update
================
-Rewrote mod.
-Steam converters now have a timer.
-Added Gunpowder Generator.
*/

var version = "0.1.8.1";
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
	},
	boilerMaxCoal:16,
	boilerMaxWater:1000,
	boilerMaxSteam:2000,
	steamConverterMaxSteam:1000,
	steamConverterMaxEnergy:1000,
	coalGenMaxCoal:16,
	coalGenMaxEnergy:1000,
	lavaGenMaxLava:1000,
	lavaGenMaxEnergy:1000,
	gunpowderGenMaxGunpowder:16,
	gunpowderGenMaxEnergy:1000,
	solarGenStartTime:0,
	solarGenEndTime:10000,
	solarGenMaxEnergy:1000,
	steamGenMaxWater:1000,
	steamGenMaxCoal:16,
	steamGenMaxEnergy:1000
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
	clientMessage("SurvivalPE v"+version+" is made by CrazyWolfy23");
}

function leaveGame(){
	saveVariables();
}

function useItem(x,y,z,itemId,blockId,side,itemDmg,blockDmg){
	blockPos = getTrueXYZ(x,y,z,side);
	
	//Multiblock Boiler
	if(itemId == id.block.boiler){
		if(!SurvivalPE.multiblockGen.boiler[blockPos]){
			SurvivalPE.multiblockGen.boiler[blockPos] = {
				water:0,
				coal:0,
				timer:0,
				steam:0
			}
		}
	}
	if(blockId == id.block.boiler){
		if(itemId == 263 && SurvivalPE.multiblockGen.boiler[[x,y,z]].coal < SurvivalPE.boilerMaxCoal){
			SurvivalPE.multiblockGen.boiler[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
		if(itemId == 325 && itemDmg == 8 && (SurvivalPE.multiblockGen.boiler[[x,y,z]].water+999) < SurvivalPE.boilerMaxWater){
			SurvivalPE.multiblockGen.boiler[[x,y,z]].water+=1000;
			Player.addItemInventory(325,1,0);
		}
	}
	
	//Multiblock Steam Converter
	if(itemId == id.block.steamConverter){
		if(!SurvivalPE.multiblockGen.steamConverter[blockPos]){
			SurvivalPE.multiblockGen.steamConverter[blockPos] = {
				steam:0,
				timer:0,
				energy:0
			}
		}
	}
	
	//Coal Generator
	if(itemId == id.block.coalGen){
		if(!SurvivalPE.generators.coalGen[blockPos]){
			SurvivalPE.generators.coalGen[blockPos] = {
				coal:0,
				timer:0,
				energy:0
			}
		}
	}
	if(blockId == id.block.coalGen){
		if(itemId == 263 && SurvivalPE.generators.coalGen[[x,y,z]].coal < SurvivalPE.coalGenMaxCoal){
			SurvivalPE.generators.coalGen[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
	}
	
	//Lava Generator
	if(itemId == id.block.lavaGen){
		if(!SurvivalPE.generators.lavaGen[blockPos]){
			SurvivalPE.generators.lavaGen[blockPos] = {
				lava:0,
				timer:0,
				energy:0
			}
		}
	}
	if(blockId == id.block.lavaGen){
		if(itemId == 325 && itemDmg == 10 && (SurvivalPE.generators.lavaGen[[x,y,z]].lava+999) < SurvivalPE.lavaGenMaxLava){
			SurvivalPE.generators.lavaGen[[x,y,z]].lava+=1000;
			Entity.setCarriedItem(Player.getEntity(), 325, Player.getCarriedItemCount()-1,10);
			Player.addItemInventory(325,1,0);
		}
	}
	
	//Gunpowder Generator
	if(itemId == id.block.gunpowderGen){
		if(!SurvivalPE.generators.gunpowderGen[blockPos]){
			SurvivalPE.generators.gunpowderGen[blockPos] = {
				gunpowder:0,
				timer:0,
				energy:0
			}
		}
	}
	if(blockId == id.block.gunpowderGen){
		if(itemId == 289 && SurvivalPE.generators.gunpowderGen[[x,y,z]].gunpowder < SurvivalPE.gunpowderGenMaxGunpowder){
			SurvivalPE.generators.gunpowderGen[[x,y,z]].gunpowder++;
			Entity.setCarriedItem(Player.getEntity(), 289, Player.getCarriedItemCount()-1,0);
		}
	}
	
	//Solar Generator
	if(itemId == id.block.solarGen){
		if(!SurvivalPE.generators.solarGen[blockPos]){
			SurvivalPE.generators.solarGen[blockPos] = {
				energy:0
			}
		}
	}
	
	//Steam Generator
	if(itemId == id.block.steamGen){
		if(!SurvivalPE.generators.steamGen[blockPos]){
			SurvivalPE.generators.steamGen[blockPos] = {
				water:0,
				coal:0,
				bTimer:0,
				steam:0,
				sTimer:0,
				energy:0
			}
		}
	}
	if(blockId == id.block.steamGen){
		if(itemId == 263 && SurvivalPE.generators.steamGen[[x,y,z]].coal < SurvivalPE.steamGenMaxCoal){
			SurvivalPE.generators.steamGen[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
		if(itemId == 325 && itemDmg == 8 && (SurvivalPE.generators.steamGen[[x,y,z]].water+999) < SurvivalPE.steamGenMaxWater){
			SurvivalPE.generators.steamGen[[x,y,z]].water+=1000;
			Player.addItemInventory(325,1,0);
		}
	}
}

function destroyBlock(x,y,z,side){
	var blockId = Player.getPointedBlockId();
	
	//Multiblock Boiler
	if(blockId == id.block.boiler && SurvivalPE.multiblockGen.boiler[[x,y,z]]){
		if(SurvivalPE.multiblockGen.boiler[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,SurvivalPE.multiblockGen.boiler[[x,y,z]].coal);
		}
		if(SurvivalPE.multiblockGen.boiler[[x,y,z]].timer > 0){
			explode(x,y,z,5,false); //Test
		}
		delete SurvivalPE.multiblockGen.boiler[[x,y,z]];
	}
	
	//Multiblock Steam Converter
	if(blockId == id.block.steamConverter && SurvivalPE.multiblockGen.steamConverter[[x,y,x]]){
		if(SurvivalPE.multiblockGen.steamConverter[[x,y,z]].timer > 0){
			explode(x,y,z,5,false); //Test
		}
		delete SurvivalPE.multiblockGen.steamConverter[[x,y,z]];
	}
	
	//Coal Generator
	if(blockId == id.block.coalGen && SurvivalPE.generators.coalGen[[x,y,z]]){
		if(SurvivalPE.generators.coalGen[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,SurvivalPE.generators.coalGen[[x,y,z]].coal);
		}
		if(SurvivalPE.generators.coalGen[[x,y,z]].timer > 0){
			explode(x,y,z,5,false); //Test
		}
		delete SurvivalPE.generators.coalGen[[x,y,z]];
	}
	
	//Lava Generator
	if(blockId == id.block.lavaGen && SurvivalPE.generators.lavaGen[[x,y,z]]){
		if(SurvivalPE.generators.lavaGen[[x,y,z]].timer > 0){
			explode(x,y,z,5,false); //Test
		}
		delete SurvivalPE.generators.lavaGen[[x,y,z]];
	}
	
	//Gunpowder Generator
	if(blockId == id.block.gunpowderGen && SurvivalPE.generators.gunpowderGen[[x,y,z]]){
		if(SurvivalPE.generators.gunpowderGen[[x,y,z]].gunpowder > 0){
			Level.dropItem(x,y,z,0,289,SurvivalPE.generators.gunpowderGen[[x,y,z]].gunpowder);
		}
		if(SurvivalPE.generators.gunpowderGen[[x,y,z]].timer > 0){
			explode(x,y,z,5,false); //Test
		}
		delete SurvivalPE.generators.gunpowderGen[[x,y,z]];
	}
	
	//Solar Generator
	if(blockId == id.block.solarGen && SurvivalPE.generators.solarGen[[x,y,z]]){
		delete SurvivalPE.generators.solarGen[[x,y,z]];
	}
	
	//Steam Generator
	if(blockId == id.block.steamGen && SurvivalPE.generators.steamGen[[x,y,z]]){
		if(SurvivalPE.generators.steamGen[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,SurvivalPE.generators.steamGen[[x,y,z]].coal);
		}
		if(SurvivalPE.generators.steamGen[[x,y,z]].timer > 0){
			explode(x,y,z,10,false);
		}
		delete SurvivalPE.generators.steamGen[[x,y,z]];
	}
}

function modTick(){
	//Multiblock Boiler
	//Multiblock Steam Converter
	//Coal Generator
	//Lava Generator
	//Gunpowder Generator
	//Solar Generator
	//Steam Generator
}

function getTrueXYZ(x,y,z,side){
	if(side == 0) y = y - 1;
	else if(side == 1) y = y + 1;
	else if(side == 2) z = z - 1;
	else if(side == 3) z = z + 1;
	else if(side == 4) x = x - 1;
	else if(side == 5) x = x + 1;
	return [x,y,z];
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