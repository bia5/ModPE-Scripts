//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

/*
TODO
===============
-Textures
-GUI
*/

/*
Updates
===============
-v0.1.3
  Added Coal Generator.
  Added Lava Generator.
  Added Steam Generator.
  Reprogramed Multiblock Steam Generators.
  Fixed Generators ids.
  Tweaked Solar Generator.
  Added Log
-v0.1.2
  Added Solar Generator.
-v0.1.1
  Added Some new Blocks.
  Fixed Versions.
-v0.1.0
  Added Steam Boiler.
  Added Steam Tank.
  Added Steam Converter.
  Added Spin Wheel.
  Added Steam Pipe and Steam Extraction Pipe.
  Added Electric Pipe and Electric Extraction Pipe.
*/

var machines = {
	boiler:{},
	tank:{},
	steamConverter:{},
	spinWheel:{}
}
var generators = {
	coal: {},
	lava: {},
	gunpowder: {},
	solar: {},
	steam: {}
}
var version = "0.1.3";
var tick = 0;
var Data = {};
var lastXYZ = [];
var blockPos;
var wires = [188,189,190,191];
var boilerMaxSteam = 500;
var boilerMaxCoal = 16;
var boilerMaxWater = 1000;
var tankMaxSteam = 10000;
var steamConverterMaxSteam = 500;
var steamConverterMaxEnergy = 500;
var spinWheelMaxEnergy = 10000;
var coalGenMaxEnergy = 500;
var coalGenMaxCoal = 16;
var lavaGenMaxEnergy = 500;
var lavaGenMaxLava = 1000;
var solarGenMaxEnergy = 500;
var steamGenMaxEnergy = 500;
var steamGenMaxSteam = 500;
var steamGenMaxCoal = 16;
var steamGenMaxWater = 1000;

ModPE.setItem(500,"apple",0,"Steam Pipe");
ModPE.setItem(501,"apple",0,"Steam Extraction Pipe");
ModPE.setItem(502,"apple",0,"Electric Pipe");
ModPE.setItem(503,"apple",0,"Electric Extraction Pipe");
ModPE.setItem(504,"apple",0,"Blue Wrench");

Block.defineBlock(33,"Boiler",["iron_block",0]);
Block.setDestroyTime(28,0);
Block.defineBlock(34,"Steam Tank",["iron_block",0]);
Block.setDestroyTime(29,0);
Block.defineBlock(36,"Steam Converter",["iron_block",0]);
Block.setDestroyTime(33,0);
Block.defineBlock(43,"Spin Wheel",["iron_block",0]);
Block.setDestroyTime(34,0);
Block.defineBlock(54,"Coal Generator",["iron_block",0]);
Block.setDestroyTime(54,0);
Block.defineBlock(55,"Lava Generator",["iron_block",0]);
Block.setDestroyTime(55,0);
Block.defineBlock(69,"Solar Generator",["iron_block",0]);
Block.setDestroyTime(69,0);
Block.defineBlock(70,"Steam Generator",["iron_block",0]);
Block.setDestroyTime(70,0);
Block.defineBlock(191,"Pipe",["iron_block",0],7,false,0);
Block.defineBlock(188,"Pipe",["iron_block",0],7,false,0);
Block.defineBlock(189,"Pipe",["iron_block",0],7,false,0);
Block.defineBlock(190,"Pipe",["iron_block",0],7,false,0);
Block.setShape(191,-0.25,0.25,0.25,1.25,0.75,0.75);
Block.setShape(188,0.25,0.25,0.25,0.75,0.75,0.75);
Block.setShape(189,0.25,0.25,-0.25,0.75,0.75,1.25);
Block.setShape(190,0.25,-0.25,0.25,0.75,1.25,0.75);
for(var i=188;i<192;i++){
	Block.setLightOpacity(i,0.0001);
	Block.setDestroyTime(i,0.5);
	Block.setRenderLayer(i,4);
}

function newLevel(){
	Data.loadMachines();
	Data.loadGenerators();
	clientMessage("SurvivalPE is made by CrazyWolfy23");
}

function leaveGame(){
	Data.saveMachines();
	Data.saveGenerators();
}

function useItem(x,y,z,itemId,blockId,side,itemD,blockD){
	blockPos = getTrueXYZ(x,y,z,side);
	if(itemId == 504 && isWire(x,y,z)){
		switch(blockId){
			case 188:
				Level.setTile(x,y,z,189,blockD);
				break;
			case 189:
				Level.setTile(x,y,z,190,blockD);
				break;
			case 190:
				Level.setTile(x,y,z,191,blockD);
				break;
			case 191:
				Level.setTile(x,y,z,188,blockD);
				break;
		}
	}
	
	//Generator Stuffs
	if(blockId == 54 && generators.coal[[x,y,z]]){
		if(itemId == 263 && generators.coal[[x,y,z]].coal < coalGenMaxCoal){
			generators.coal[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
	}
	if(itemId == 54){
		if(!generators.coal[blockPos]){
			generators.coal[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				energy:0,
				coal:0,
				timer:0
			}
		}
	}
	if(blockId == 55 && generators.lava[[x,y,z]]){
		if(itemId == 337 && (generators.lava[[x,y,z]].lava + 999) < lavaGenMaxLava){
			generators.lava[[x,y,z]].lava+=1000;
			Entity.setCarriedItem(Player.getEntity(), 337, Player.getCarriedItemCount()-1,0);
			Player.addItemInventory(333,1,0);
		}
	}
	if(itemId == 55){
		if(!generators.lava[blockPos]){
			generators.lava[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				energy:0,
				lava:0,
				timer:0
			}
		}
	}
	if(itemId == 69){
		if(!generators.solar[blockPos]){
			generators.solar[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				energy:0,
				isActive:false
			}
		}
	}
	if(blockId == 28 && generators.steam[[x,y,z]]){
		if(itemId == 263 && generators.steam[[x,y,z]].coal < steamGenMaxCoal){
			generators.steam[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
		if(itemId == 336 && (generators.steam[[x,y,z]].water + 999) < steamGenMaxWater){
			generators.steam[[x,y,z]].water+=1000;
			Entity.setCarriedItem(Player.getEntity(), 336, Player.getCarriedItemCount()-1,0);
			Player.addItemInventory(333,1,0);
		}
	}
	if(itemId == 70){
		if(!generators.steam[blockPos]){
			generators.steam[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				energy:0,
				steam:0,
				water:0,
				coal:0,
				sTimer:0,
				eTimer:0
			}
		}
	}
	
	//Steam Stuffs
	if(blockId == 28 && machines.boiler[[x,y,z]]){
		if(itemId == 263 && machines.boiler[[x,y,z]].coal < boilerMaxCoal){
			machines.boiler[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
		if(itemId == 336 && (machines.boiler[[x,y,z]].water + 1000) < boilerMaxWater){
			machines.boiler[[x,y,z]].water+=1000;
			Entity.setCarriedItem(Player.getEntity(), 336, Player.getCarriedItemCount()-1,0);
			Player.addItemInventory(333,1,0);
		}
	}
	if(itemId == 28){
		if(!machines.boiler[blockPos]){
			machines.boiler[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				water:0,
				steam:0,
				timer:0,
				coal:0
			}
		}
	}
	if(itemId == 29){
		if(!machines.tank[blockPos]){
			machines.tank[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				steam:0
			}
		}
	}
	if(itemId == 33){
		if(!machines.steamConverter[blockPos]){
			machines.steamConverter[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				steam:0,
				energy:0
			}
		}
	}
	if(itemId == 34){
		if(!machines.spinWheel[blockPos]){
			machines.spinWheel[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				energy:0
			}
		}
	}
	
	//Pipes
	if(itemId == 500){
		Entity.setCarriedItem(Player.getEntity(),500,Player.getCarriedItemCount()-1,0);
		placePipe(blockPos[0],blockPos[1],blockPos[2],0);
	}
	if(itemId == 501){
		Entity.setCarriedItem(Player.getEntity(),501,Player.getCarriedItemCount()-1,0);
		placePipe(blockPos[0],blockPos[1],blockPos[2],1);
	}
	if(itemId == 502){
		Entity.setCarriedItem(Player.getEntity(),502,Player.getCarriedItemCount()-1,0);
		placePipe(blockPos[0],blockPos[1],blockPos[2],2);
	}
	if(itemId == 503){
		Entity.setCarriedItem(Player.getEntity(),503,Player.getCarriedItemCount()-1,0);
		placePipe(blockPos[0],blockPos[1],blockPos[2],3);
	}
}

function destroyBlock(x,y,z,side){
	if(Player.getPointedBlockId() == 54 && generators.coal[[x,y,z]]){
		if(generators.coal[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,generators.coal[[x,y,z]].coal);
		}
		delete generators.coal[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 55 && generators.lava[[x,y,z]]){
		delete generators.lava[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 69 && generators.solar[[x,y,z]]){
		delete generators.solar[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 70 && generators.steam[[x,y,z]]){
		if(generators.steam[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,generators.steam[[x,y,z]].coal);
		}
		delete generators.steam[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 28 && machines.boiler[[x,y,z]]){
		if(machines.boiler[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,machines.boiler[[x,y,z]].coal);
		}
		delete machines.boiler[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 29 && machines.tank[[x,y,z]]){
		delete machines.tank[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 33 && machines.steamConverter[[x,y,z]]){
		delete machines.steamConverter[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 34 && machines.spinWheel[[x,y,z]]){
		delete machines.spinWheel[[x,y,z]];
	}
}

function modTick(){
	tick++;
	
	//Generators
	for(blockPos in generators.coal){
		if(generators.coal[blockPos].coal > 0 && generators.coal[blockPos].timer == 0 && generators.coal[blockPos].energy < coalGenMaxEnergy){
			generators.coal[blockPos].coal--;
			generators.coal[blockPos].timer+=100;
		}
		if(generators.coal[blockPos].timer > 0){
			generators.coal[blockPos].timer--;
			if(generators.coal[blockPos].energy < coalGenMaxEnergy){
				generators.coal[blockPos].energy++;
			}
		}
		if(generators.coal[blockPos].energy > 99 && isWire(generators.coal[blockPos].x,generators.coal[blockPos].y+1,generators.coal[blockPos].z) && Level.getData(generators.coal[blockPos].x,generators.coal[blockPos].y+1,generators.coal[blockPos].z) == 4){
			generators.coal[blockPos].energy-=100;
			sendEnergy(generators.coal[blockPos].x,generators.coal[blockPos].y+1,generators.coal[blockPos].z,generators.coal[blockPos].x,generators.coal[blockPos].y,generators.coal[blockPos].z,100);
		}
	}
	for(blockPos in generators.lava){
		if(generators.lava[blockPos].lava > 999 && generators.lava[blockPos].timer == 0 && generators.lava[blockPos].energy < lavaGenMaxEnergy){
			generators.lava[blockPos].lava-=1000;
			generators.lava[blockPos].timer+=100;
		}
		if(generators.lava[blockPos].timer > 0){
			generators.lava[blockPos].timer--;
			if((generators.lava[blockPos].energy+2) < lavaGenMaxEnergy){
				generators.lava[blockPos].energy+=3;
			}
		}
		if(generators.lava[blockPos].energy > 99 && isWire(generators.lava[blockPos].x,generators.lava[blockPos].y+1,generators.lava[blockPos].z) && Level.getData(generators.lava[blockPos].x,generators.lava[blockPos].y+1,generators.lava[blockPos].z) == 4){
			generators.lava[blockPos].energy-=100;
			sendEnergy(generators.lava[blockPos].x,generators.lava[blockPos].y+1,generators.lava[blockPos].z,generators.lava[blockPos].x,generators.lava[blockPos].y,generators.lava[blockPos].z,100);
		}
	}
	for(blockPos in generators.solar){
		if(tick == 20){
			for(var i = 0; i<256-generators.solar[blockPos].y; i++){
				if(Level.getTile(generators.solar[blockPos].x,i,generators.solar[blockPos].z) != 0){
					generators.solar[blockPos].isActive = false;
				}
			}
			if(generators.solar[blockPos].isActive && generators.solar[blockPos].energy < solarGenMaxEnergy){
				generators.solar[blockPos].energy+=10;
			}
		}
		if(generators.solar[blockPos].energy > 99 && isWire(generators.solar[blockPos].x,generators.solar[blockPos].y+1,generators.solar[blockPos].z) && Level.getData(generators.solar[blockPos].x,generators.solar[blockPos].y+1,generators.solar[blockPos].z) == 4){
			generators.solar[blockPos].energy-=100;
			sendEnergy(generators.solar[blockPos].x,generators.solar[blockPos].y+1,generators.solar[blockPos].z,generators.solar[blockPos].x,generators.solar[blockPos].y,generators.solar[blockPos].z,100);
		}
	}
	for(blockPos in generators.steam){
		if(generators.steam[blockPos].coal > 0 && generators.steam[blockPos].sTimer == 0 && generators.steam[blockPos].steam < steamGenMaxSteam && generators.steam[blockPos].water > 999){
			machines.steam[blockPos].water-=1000;
			machines.steam[blockPos].coal--;
			machines.steam[blockPos].sTimer+=100;
		}
		if(generators.steam[blockPos].sTimer > 0){
			generators.steam[blockPos].sTimer--;
			if(generators.steam[blockPos].steam < steamGenMaxSteam){
				generators.steam[blockPos].steam++;
			}
		}
		if(generators.steam[blockPos].eTimer == 0 && generators.steam[blockPos].steam > 99 && generators.steam[blockPos].energy < steamConverterMaxEnergy){
			generators.steam[blockPos].steam-=100;
			generators.steam[blockPos].eTimer+=50
		}
		
		if(generators.steam[blockPos].eTimer > 0){
			generators.steam[blockPos].eTimer--;
			if(generators.steam[blockPos].energy < steamGenMaxEnergy){
				generators.steam[blockPos].energy++;
			}
		}
		if(generators.steam[blockPos].energy > 99 && isWire(generators.steam[blockPos].x,generators.steam[blockPos].y+1,generators.steam[blockPos].z) && Level.getData(generators.steam[blockPos].x,generators.steam[blockPos].y+1,generators.steam[blockPos].z) == 4){
			generators.steam[blockPos].energy-=100;
			sendEnergy(generators.steam[blockPos].x,generators.steam[blockPos].y+1,generators.steam[blockPos].z,generators.steam[blockPos].x,generators.steam[blockPos].y,generators.steam[blockPos].z,100);
		}
	}
	
	//MulitBlock Steam Generator
	for(blockPos in machines.boiler){
		if(machines.boiler[blockPos].coal > 0 && machines.boiler[blockPos].timer == 0 && machines.boiler[blockPos].steam < boilerMaxSteam && machines.boiler[blockPos].water > 999){
			machines.boiler[blockPos].water-=1000;
			machines.boiler[blockPos].coal--;
			machines.boiler[blockPos].timer+=100;
		}
		if(machines.boiler[blockPos].timer > 0){
			machines.boiler[blockPos].timer--;
			if(machines.boiler[blockPos].steam < boilerMaxSteam){
				machines.boiler[blockPos].steam++;
			}
		}
		if(machines.boiler[blockPos].steam > 99 && isWire(machines.boiler[blockPos].x,machines.boiler[blockPos].y+1,machines.boiler[blockPos].z) && Level.getData(machines.boiler[blockPos].x,machines.boiler[blockPos].y+1,machines.boiler[blockPos].z) == 1){
			machines.boiler[blockPos].steam-=100;
			sendSteam(machines.boiler[blockPos].x,machines.boiler[blockPos].y+1,machines.boiler[blockPos].z,machines.boiler[blockPos].x,machines.boiler[blockPos].y,machines.boiler[blockPos].z,100);
		}
	}
	for(blockPos in machines.tank){
		if(machines.tank[blockPos].steam > 99 && isWire(machines.tank[blockPos].x,machines.tank[blockPos].y+1,machines.tank[blockPos].z) && Level.getData(machines.tank[blockPos].x,machines.tank[blockPos].y+1,machines.tank[blockPos].z) == 1){
			machines.tank[blockPos].steam-=100;
			sendSteam(machines.tank[blockPos].x,machines.tank[blockPos].y+1,machines.tank[blockPos].z,machines.tank[blockPos].x,machines.tank[blockPos].y,machines.tank[blockPos].z,100);
		}
	}
	for(blockPos in machines.steamConverter){
		if(machines.steamConverter[blockPos].steam > 99 && steamConverterMaxEnergy > (machines.steamConverter[blockPos].energy + 99)){
			machines.steamConverter[blockPos].steam-=100;
			machines.steamConverter[blockPos].timer+=50;
		}
		if(machines.steamConverter[blockPos].timer > 0){
			machines.steamConverter[blockPos].timer--;
			if(machines.steamConverter[blockPos].energy < steamConverterMaxEnergy){
				machines.steamConverter[blockPos].energy++;
			}
		}
		if(machines.steamConverter[blockPos].energy > 99 && isWire(machines.steamConverter[blockPos].x,machines.steamConverter[blockPos].y+1,machines.steamConverter[blockPos].z) && Level.getData(machines.steamConverter[blockPos].x,machines.steamConverter[blockPos].y+1,machines.steamConverter[blockPos].z) == 4){
			machines.steamConverter[blockPos].energy-=100;
			sendEnergy(machines.steamConverter[blockPos].x,machines.steamConverter[blockPos].y+1,machines.steamConverter[blockPos].z,machines.steamConverter[blockPos].x,machines.steamConverter[blockPos].y,machines.steamConverter[blockPos].z,100);
		}
	}
}

function sendEnergy(x,y,z,xx,yy,zz,energy){
	var sides=[[x,y-1,z],[x,y+1,z],[x,y,z-1],[x,y,z+1],[x-1,y,z],[x+1,y,z]];
	if(isWire(x,y,z)){
		var amt = 0;
		var places = [];
		for(var i = 0; i<sides.length; i++){
			var sx = sides[i][0];
			var sy = sides[i][1];
			var sz = sides[i][2];
			var tile = Level.getTile(sx,sy,sz);
			var data = Level.getData(sx,sy,sz);
			if([xx,yy,zz] != [sx,sy,sz] && ((isWire(sx,sy,sz) && data == 1) || (tile == 34))){
				amt++;
				places.push([sides[i][0],sides[i][1],sides[i][2]]);
			}
		}
		if(amt > 0){
			var rnd = Math.floor(Math.random()*places.length);
			if(isWire(places[rnd][0],places[rnd][1],places[rnd][2])){
				sendEnergy(places[rnd][0],places[rnd][1],places[rnd][2],x,y,z,energy);
			}
			if(Level.getTile(places[rnd][0],places[rnd][1],places[rnd][2]) == 34 && (machines.spinWheel[[places[rnd][0],places[rnd][1],places[rnd][2]]].energy + energy) <= spinWheelMaxEnergy){}
		}
	}
}

function sendSteam(x,y,z,xx,yy,zz,steam){
	var sides=[[x,y-1,z],[x,y+1,z],[x,y,z-1],[x,y,z+1],[x-1,y,z],[x+1,y,z]];
	if(isWire(x,y,z)){
		var amt = 0;
		var places = [];
		for(var i = 0; i<sides.length; i++){
			var sx = sides[i][0];
			var sy = sides[i][1];
			var sz = sides[i][2];
			var tile = Level.getTile(sx,sy,sz);
			var data = Level.getData(sx,sy,sz);
			if([xx,yy,zz] != [sx,sy,sz] && ((isWire(sx,sy,sz) && data == 0) || (tile == 29) || (tile == 33))){
				amt++;
				places.push([sides[i][0],sides[i][1],sides[i][2]]);
			}
		}
		if(amt > 0){
			var rnd = Math.floor(Math.random()*places.length);
			if(isWire(places[rnd][0],places[rnd][1],places[rnd][2])){
				sendSteam(places[rnd][0],places[rnd][1],places[rnd][2],x,y,z,steam);
			}
			if(Level.getTile(places[rnd][0],places[rnd][1],places[rnd][2]) == 29 && (machines.tank[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam + steam) <= tankMaxSteam){
				machines.tank[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam+=steam;
			}
			if(Level.getTile(places[rnd][0],places[rnd][1],places[rnd][2]) == 34 && (machines.steamConverter[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam + steam) <= steamConverterMaxSteam){
				machines.steamConverter[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam+=steam;
			}
		}
	}
}

function placePipe(x,y,z,data){
	var sides=[[x,y-1,z],[x,y+1,z],[x,y,z-1],[x,y,z+1],[x-1,y,z],[x+1,y,z]];
	var hasPlaced = false;
	for(var i = 0; i<sides.length; i++){
		var a;
		if(i == 0 || i == 1){
			a = 190;
		}
		else if(i == 2 || i == 3){
			a = 189;
		}
		else if(i == 4 || i == 5){
			a = 191;
		}
		
		if(isWire(sides[i][0],sides[i][1],sides[i][2])){
			hasPlaced = true;
			Level.setTile(x,y,z,a,data);
		}
	}
	if(hasPlaced == false){
		Level.setTile(x,y,z,188,data);
	}
}

function isWire(x,y,z){
	if(Level.getTile(x,y,z) == wires[0] || Level.getTile(x,y,z) == wires[1] || Level.getTile(x,y,z) == wires[2] || Level.getTile(x,y,z) == wires[3]){
		return true;
	}
}

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

Data.loadMachines=function(){
	java.io.File(new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE")).mkdirs();
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Machines.txt");
	if(!data.exists()) return false; data.createNewFile();
	var fos=new java.io.FileInputStream(data);
	var str=new java.lang.StringBuilder(); var ch;
	while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
	machines=JSON.parse(String(str.toString())); fos.close();
}

Data.saveMachines=function(){
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Machines.txt");
	if(data.exists()) data.delete(); data.createNewFile();
	var outWrite=new java.io.OutputStreamWriter(new java.io.FileOutputStream(data));
	outWrite.append(JSON.stringify(machines)); outWrite.close();
	machines={};
}

Data.loadGenerators=function(){
	java.io.File(new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE")).mkdirs();
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Generators.txt");
	if(!data.exists()) return false; data.createNewFile();
	var fos=new java.io.FileInputStream(data);
	var str=new java.lang.StringBuilder(); var ch;
	while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
	generators=JSON.parse(String(str.toString())); fos.close();
}

Data.saveGenerators=function(){
	var data=new java.io.File(new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftworlds/"+Level.getWorldDir()+"/SurvivalPE/Generators.txt");
	if(data.exists()) data.delete(); data.createNewFile();
	var outWrite=new java.io.OutputStreamWriter(new java.io.FileOutputStream(data));
	outWrite.append(JSON.stringify(generators)); outWrite.close();
	generators={};
}