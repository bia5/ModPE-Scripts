//OpenVariables By CrazyWolfy23

/* ---    OpenVariables    ---
==============================
	OpenVariables is a mod
that lets all modder communicate
easier than native blocklauncher
functions. The way it works is
every second to minute it will
save variables to a common file
that all mods should use, then
another mod can read the file
to find the variables in the file.
All you need to do is copy the code
in this file and use the functions
when needed.
					~CrazyWolfy23
*/

/* ---    License    ---
========================

MIT License

Copyright (c) 2016 CrazyWolfy23

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* ---    Functions    --
=========================
setGVariable(modId,variableName,value); Sets another mods variable.
getGVariable(modId,variableName,value); Gets another mods variable value.
setVariable(variableName,value); Adds/Sets a local variable.
getVariable(variableName); Gets a local variable value.
delVariable(variableName); Deletes a local variable.
get(); Force updates your localVariables.
save(); Force saves your localVariables.
*/

//Config Variables (#CHANGE!#)
var modID = "ExampleMod"; //modId will help with compatability
var maxTick = 100; //maxTick will determine when variables save. (Ticks per second is 20) (#Making the maxTick to small could lag your game#)

//Private Variables (#DONT CHANGE!#)
var openVariablesVersion = "1.0";
var hasSavedVersion = false;
var tick = 0;
var path = new android.os.Environment.getExternalStorageDirectory().getPath()+"/games/com.mojang/minecraftpe/openVariables/";
var localVariables = {};

//Functions that apply to local
function setGVariable(modId,variableName,value){
	var temp = get(modId);
	temp[variableName] = value;
	save(modId,temp);
}
function getGVariable(modId,variableName,value){
	var temp = get(modId);
	return temp[variableName];
}

//Functions that apply to local
function getVariable(variableName){
	return localVariables[variableName];
}
function setVariable(variableName,value){
	localVariables[variableName] = value;
}
function delVariable(variableName){
	delete localVariables[variableName];
}
function get(){
	localVariables = get(modID);
}
function save(){
	save(modID,localVariables);
}

function getG(modId){
	java.io.File(new java.io.File(path+modId)).mkdirs();
	var data=new java.io.File(path+modId);
	if(!data.exists()) return false;
	var fos=new java.io.FileInputStream(data);
	var str=new java.lang.StringBuilder(); var ch;
	while((ch=fos.read())!=-1) str.append(java.lang.Character(ch));
	temp = JSON.parse(String(str.toString())); fos.close();
	return temp;
}

function saveTG(modId,jsonArray){ // Force saving 
	var data=new java.io.File(path+modId);
	if(data.exists()) data.delete(); data.createNewFile();
	var outWrite=new java.io.OutputStreamWriter(new java.io.FileOutputStream(data));
	outWrite.append(JSON.stringify(jsonArray)); outWrite.close();
}

function modTick(){
	tick++;
	if(tick >= maxTick){
		if(!hasSavedVersion){localVariables["openVariablesVersion"] = openVariablesVersion;hasSavedVersion=true;}
		save(); get();
	}
}