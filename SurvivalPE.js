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
-
*/

var machines = {
	boilers:{},
	tanks:{},
	steamConverter:{},
	spinWheel:{}
}
var version = "0.2.0";
var Data = {};
var lastXYZ = [];
var blockPos;
var wires = [188,189,190,191];
var boilerMaxSteam = 500;
var boilerMaxCoal = 16;
var tankMaxSteam = 10000;
var steamConverterMaxSteam = 500;
var steamConverterMaxEnergy = 500;
var spinWheelMaxEnergy = 10000;

ModPE.setItem(500,"apple",0,"Steam Pipe");
ModPE.setItem(501,"apple",0,"Extraction Pipe (Steam)");
ModPE.setItem(502,"apple",0,"Electric Pipe");
ModPE.setItem(503,"apple",0,"Extraction Pipe (Electric)");
ModPE.setItem(504,"apple",0,"Wrench (Blue)");

Block.defineBlock(28,"Boiler",["iron_block",0]);
Block.setDestroyTime(28,0);
Block.defineBlock(29,"Steam Tank",["iron_block",0]);
Block.setDestroyTime(29,0);
Block.defineBlock(33,"Steam Converter",["iron_block",0]);
Block.setDestroyTime(33,0);
Block.defineBlock(34,"Spin Wheel",["iron_block",0]);
Block.setDestroyTime(34,0);
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
	clientMessage("SurvivalPE is made by CrazyWolfy23");
}

function leaveGame(){
	Data.saveMachines();
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
	if(blockId == 28 && machines.boilers[[x,y,z]]){
		if(itemId == 263 && machines.boilers[[x,y,z]].coal < boilerMaxCoal){
			machines.boilers[[x,y,z]].coal++;
			Entity.setCarriedItem(Player.getEntity(), 263, Player.getCarriedItemCount()-1,0);
		}
	}
	if(blockId == 29){
		clientMessage(machines.tanks[[x,y,z]].steam);
	}
	if(blockId == 28){
		clientMessage(machines.boilers[[x,y,z]].steam);
	}
	if(itemId == 28){
		if(!machines.boilers[blockPos]){
			machines.boilers[blockPos] = {
				x:blockPos[0],
				y:blockPos[1],
				z:blockPos[2],
				steam:0,
				timer:0,
				coal:0
			}
		}
	}
	if(itemId == 29){
		if(!machines.tanks[blockPos]){
			machines.tanks[blockPos] = {
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
	if(Player.getPointedBlockId() == 28 && machines.boilers[[x,y,z]]){
		if(machines.boilers[[x,y,z]].coal > 0){
			Level.dropItem(x,y,z,0,263,machines.boilers[[x,y,z]].coal);
		}
		delete machines.boilers[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 29 && machines.tanks[[x,y,z]]){
		delete machines.tanks[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 33 && machines.steamConverter[[x,y,z]]){
		delete machines.steamConverter[[x,y,z]];
	}
	if(Player.getPointedBlockId() == 34 && machines.spinWheel[[x,y,z]]){
		delete machines.spinWheel[[x,y,z]];
	}
}

function modTick(){
	for(blockPos in machines.boilers){
		if(machines.boilers[blockPos].coal > 0 && machines.boilers[blockPos].timer == 0 && machines.boilers[blockPos].steam < boilerMaxSteam){
			if(Level.getTile(machines.boilers[blockPos].x,machines.boilers[blockPos].y-1,machines.boilers[blockPos].z) == 8 || Level.getTile(machines.boilers[blockPos].x,machines.boilers[blockPos].y-1,machines.boilers[blockPos].z) == 9){
				machines.boilers[blockPos].coal--;
				machines.boilers[blockPos].timer+=200;
			}
		}
		if(machines.boilers[blockPos].timer > 0){
			machines.boilers[blockPos].timer--;
			if(machines.boilers[blockPos].steam < boilerMaxSteam){
				machines.boilers[blockPos].steam++;
			}
		}
		if(machines.boilers[blockPos].steam > 99 && isWire(machines.boilers[blockPos].x,machines.boilers[blockPos].y+1,machines.boilers[blockPos].z) && Level.getData(machines.boilers[blockPos].x,machines.boilers[blockPos].y+1,machines.boilers[blockPos].z) == 1){
			machines.boilers[blockPos].steam-=100;
			sendSteam(machines.boilers[blockPos].x,machines.boilers[blockPos].y+1,machines.boilers[blockPos].z,machines.boilers[blockPos].x,machines.boilers[blockPos].y,machines.boilers[blockPos].z,100);
		}
	}
	for(blockPos in machines.tanks){
		if(isWire(machines.tanks[blockPos].x,machines.tanks[blockPos].y+1,machines.tanks[blockPos].z) && Level.getData(machines.tanks[blockPos].x,machines.tanks[blockPos].y+1,machines.tanks[blockPos].z) == 1){
			if(machines.tanks[blockPos].steam < 100 && machines.tanks[blockPos].steam > 0){
				sendSteam(machines.tanks[blockPos].x,machines.tanks[blockPos].y+1,machines.tanks[blockPos].z,machines.tanks[blockPos].x,machines.tanks[blockPos].y,machines.tanks[blockPos].z,machines.tanks[blockPos].steam);
				machines.tanks[blockPos].steam-=machines.tanks[blockPos].steam;
			}if(machines.tanks[blockPos].steam > 99){
				machines.tanks[blockPos].steam-=100;
				sendSteam(machines.tanks[blockPos].x,machines.tanks[blockPos].y+1,machines.tanks[blockPos].z,machines.tanks[blockPos].x,machines.tanks[blockPos].y,machines.tanks[blockPos].z,100);
			}
		}
	}
	for(blockPos in machines.steamConverter){
		if(machines.steamConverter[blockPos].steam > 99 && steamConverterMaxEnergy > (machines.steamConverter[blockPos].energy + 99)){
			machines.steamConverter[blockPos].energy+=100;
			machines.steamConverter[blockPos].steam-=100;
		}if(machines.steamConverter[blockPos].energy > 99){
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
			if(Level.getTile(places[rnd][0],places[rnd][1],places[rnd][2]) == 29 && (machines.tanks[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam + steam) <= tankMaxSteam){
				machines.tanks[[places[rnd][0],places[rnd][1],places[rnd][2]]].steam+=steam;
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
