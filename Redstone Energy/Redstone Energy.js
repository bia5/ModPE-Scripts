//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

var version = "1.0.1";
var energyBlocksInWorld = {};

function addEnergyBlockToWorld(x,y,z,id,d,mId){
	energyBlocksInWorld[x,y,z] = {
		id:id,
		d:d,
		x:x,
		y:y,
		z:z,
		mId:mId,
		energy:0
	};
}

function addEnergyToBlock(x,y,z,amt){
	if(energyBlocksInWorld[x,y,z]){
		energyBlocksInWorld[x,y,z].energy+=amt;
	}
}

function removeEnergyFromBlock(x,y,z,amt){
	if(energyBlocksInWorld[x,y,z]){
		energyBlocksInWorld[x,y,z].energy-=amt;
	}
}

function getEnergyBlockModID(x,y,z){
	if(energyBlocksInWorld[x,y,z]){
		return energyBlocksInWorld[x,y,z].mId;
	}
}

function getEnergy(x,y,z){
	return energyBlocksInWorld[x,y,z].energy;
}

function getEnergyBlockId(x,y,z){
	return energyBlocksInWorld[x,y,z].id;
}

function getEnergyBlockData(x,y,z){
	return energyBlocksInWorld[x,y,z].d;
}

function getVersion(){
	return version;
}