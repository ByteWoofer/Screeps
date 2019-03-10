var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attacker');
var numHarvesters = 2;
var numUpgraders = 5;
var numBuilders = 5;
var numAttackers = 0;
var manifest = true;
var debugJobs = false;
module.exports.loop = function () {
//Create a boolean list of sources for if they are being used
    //console.log(!Memory.sourceInUse);
    if(!Memory.debugJobs)
        Memory.debugJobs = debugJobs;

    if (!Memory.sourceInUse) {
        console.log('Source was not in use');
        var Numsources = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;
        Memory.sourceInUse = [];
        console.log('Number of found sources: ' + Numsources);
        for (i = 0; i < Numsources; i++) {
            console.log('Marking as zero:' + i);
            Memory.sourceInUse.push(0);
        }
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if(Memory.creeps[name].sourceIndex){
                Memory.sourceInUse[Memory.creeps[name].sourceIndex]--;
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    if(Game.spawns['Spawn1'].energy >= 300){
        console.log('Harvesters: ' + harvesters.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Builders: ' + builders.length);
        console.log('Attackers: ' + attackers.length);
        if(harvesters.length < numHarvesters) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
        } else if (upgraders.length < numUpgraders) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
        } else if (builders.length < numBuilders) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
        } else if (attackers.length < numAttackers) {
            var newName = 'Attacker' + Game.time;
            console.log('Spawning new attacker: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([TOUGH,ATTACK,MOVE], newName, {memory: {role: 'attacker'}});
        }
    }
    
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
    }
}