var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.dest){
            var destination = Game.getObjectById(creep.memory.dest); // load destination from memory
        }
        if(Memory.debugJobs)
            creep.say(creep.memory.task);
        
        switch(creep.memory.task){
            case "request":
                destination = ""; 
                if(creep.carry.energy == creep.carryCapacity){
                    creep.memory.task = "bDestination";
                } else {
                    var sources = creep.room.find(FIND_SOURCES);
                    for (i = 0; i< Memory.sourceInUse.length; i++){         //iterate over sources
                        if(Memory.sourceInUse[i] < 1){         //check for available spot
                            Memory.sourceInUse[i]++;
                            destination = sources[i];
                            creep.memory.sourceIndex = i;
                            creep.memory.task = "harvest";
                            break;
                        }
                    }
                    if (destination == "") {                     //all in use, goto flag
                        creep.memory.task = "fDestination";
                    }
                }
            break;

            case "bDestination": //set build destination
                delete destination;
                var destination;
                var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                if(targets.length) {
                    destination = creep.build(targets[0]);
                } else {
                    targets = creep.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_WALL || STRUCTURE_ROAD || STRUCTURE_TOWER }});
                    for(i = 0; i<targets.length; i++){
                        if(targets[i].hits < (targets[i].hitsMax * 0.33)){
                            destination = targets[i];
                            break;
                        }
                    }
                }
                if(!destination){
                    creep.memory.task = "fDestination";
                }else{
                    creep.memory.task = "build";
                }
            break;

            case "fDestination": //set flag destination
                creep.memory.flag = "Flag1";
                creep.memory.task = "flag";
            break;

            case "flag": //Determine distance to flag and progress if outside
            var flagdest = Game.flags[creep.memory.flag];
            if(flagdest){
                if(Math.sqrt((Math.pow((creep.pos.x-flagdest.pos.x),2)+Math.pow((creep.pos.y-flagdest.pos.y),2)))>5) {
                    creep.moveTo(flagdest, {visualizePathStyle: {stroke: '#ffffff'}}); //move towards if over 5 away
                } else {
                    creep.memory.task = "request"; //request new task
                }
            }
            break;

            case "harvest": //progress to destination and harvest if energy is not full
                if(creep.carry.energy<creep.carryCapacity){
                    if(creep.harvest(destination) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(destination);
                    }
                } else {
                    Memory.sourceInUse[creep.memory.sourceIndex]--;
                    delete creep.memory.sourceIndex;
                    creep.memory.task = "bDestination";
                }
            break;
                
            case "build": //if has energy, progress to destination and build
                if(creep.carry.energy>0){
                    if(destination.structureType == ConstructionSite){
                        if(creep.build(destination) == ERR_NOT_IN_RANGE){
                            creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        if(creep.repair(destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                } else {
                    creep.memory.task = "fDestination";
                }
            break;

            default:
                creep.memory.task = "request";
        }
        //console.log('local: ' + destination);
        if(destination){
            //console.log('local destination recognized!');
            creep.memory.dest = destination.id;
        }
        creep.memory.test = destination;
        //console.log('remote mem: ' + creep.memory.dest);
    }
};

module.exports = roleBuilder;