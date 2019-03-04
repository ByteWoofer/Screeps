var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.dest){
            var destination = creep.memory.dest.getObjectById; // load destination from memory
        }

        creep.say(creep.memory.task);
        
        switch(creep.memory.task){
            case "request":
                destination = ""; 
                var sources = creep.room.find(FIND_SOURCES);
                for (i = 0; i< Memory.sourceInUse.length; i++){         //iterate over sources
                    if(Memory.sourceInUse[i] < 1){         //check for available spot
                        Memory.sourceInUse[i]++;
                        destination = sources[i];
                        creep.memory.sourceIndex = i;
                        break;
                    }
                }
                if (destination == "") {                     //all in use, goto flag
                    creep.memory.task = "fDestination";
                }
            break;

            case "dDestination": //set deposit destination
                destination = Game.spawns['Spawn1'];
                creep.memory.task = "deposit";
            break;

            case "fDestination": //set flag destination
                destination = 'Flag1';
                creep.memory.dest = destination;
                creep.memory.task = "flag";
            break;

            case "flag": //Determine distance to flag and progress if outside
            destination = "Flag1";
            if(Game.flags[destination]){
                if(Math.sqrt((Math.pow((creep.pos.x-destination.pos.x),2)+Math.pow((creep.pos.y-destination.pos.y),2)))>5) {
                    creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}}); //move towards if over 5 away
                } else {
                    creep.memory.task = "request"; //request new task
                }
            }
            break;

            case "harvest": //progress to destination and harvest if energy is not full
                if(creep.energy<creep.energyCapacity){
                    if(creep.harvest() == ERR_NOT_IN_RANGE) {
                        creep.moveTo(destination);
                    }
                } else {
                    Memory.sourceInUse[creep.memory.sourceIndex]--;
                    creep.memory.task = "dDestination";
                }
            break;

            case "deposit": //if has energy, progress to destination and transfer
                if(creep.energy>0){
                    if(creep.transfer(destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.memory.task = "fDestination";
                }
            break;

            default:
                creep.memory.task = "request";
        }
        console.log('local: ' + destination);
        if(destination.id){
            console.log('local destination recognized!');
            creep.memory.dest = destination.id;
        }
        creep.memory.test = destination;
        console.log('remote mem: ' + creep.memory.dest);
    }
};

module.exports = roleHarvester;