//Mod By CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

var version = "1.0";
var energyBlocksId = [];
var energyBlocksD = [];
var energyBlocksInWorld = {};

function setEnergyBlock(id,d){
	energyBlocksId.push(id);
	energyBlocksD.push(d);
}

function addEnergyBlockToWorld(x,y,z,id,d){
	energyBlocksInWorld[x,y,z] = {
		id:id,
		d:d,
		x:x,
		y:y,
		z:z,
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