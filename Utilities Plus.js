//Mod by CrazyWolfy23

/*
This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. 
To view a copy of this license, 
visit http://creativecommons.org/licenses/by-sa/4.0/.
*/

//Just to load my functions
function destroyBlock(x,y,z,side){
	treeChopper.run(x,y,z);
}
function useItem(x,y,z,itemId,blockId,side){
	if(blockId == 54 && Level.getTile(x,y-1,z) == 49){
		this.x = x;
		this.y = y;			
		this.z = z;
		enderChest.chestOpened = 1;
		enderChestRun();
	}
}
function leaveGame(){
	enderChest.chestOpened = 0;
	enderChest.dataReceived = 0;
	enderChest.gameEnded = 1;
}
function newLevel(){
	enderChest.gameEnded = 0;
	enderChest.chestOpened = 0;
	enderChest.dataReceived = 0;
}
function modTick(){
	enderChestTick();
}

//Ender Chest
var enderChest = {storage:{},gameEnded:0,chestOpened:0,dataRecived:0};
enderChestRun = function(){
	if(enderChest.chestOpened == 1 && enderChest.gameEnded == 0 && enderChest.dataReceived == 1){
		for(var i = 0; i<27; i++){
			Level.setChestSlot(this.x,this.y,this.z,i,enderChest.storage[i].id,enderChest.storage[i].data,enderChest.storage[i].amt);
		}
	}
}
enderChestTick = function(){
	if(enderChest.chestOpened == 1 && enderChest.gameEnded == 0 && Level.getTile(this.x,this.y,this.z) == 54 && Level.getTile(this.x,this.y-1,this.z) == 49){
		for(var i = 0; i<27; i++){
			enderChest.storage[i] = {
				id: Level.getChestSlot(this.x,this.y,this.z,i),
				amt: Level.getChestSlotCount(this.x,this.y,this.z,i),
				data: Level.getChestSlotData(this.x,this.y,this.z,i)
			}
		}
		enderChest.dataReceived = 1;
	}
}

//Tree Chopper
var treeChopper = {};
var axeIds = [258, 271, 275, 279, 286];
var woodId = [17,162];

treeChopper.run = function(x,y,z){
	var itemId = Player.getCarriedItem();
	var blockId = Player.getPointedBlockId();
	
	if(Level.getGameMode() == 0){
		if(itemId == axeIds[0] || itemId == axeIds[1] || itemId == axeIds[2] || itemId == axeIds[3] || itemId == axeIds[4]){
			if(blockId == woodId[0] || blockId == woodId[1]){
				for(var i = y+1; i<126; i++){
					if(Level.getTile(x,i,z) == woodId[0] || Level.getTile(x,i,z) == woodId[1]){
						Level.destroyBlock(x,i,z,false);
					}else{
						break;
					}
				}
			}
		}
	}
}
