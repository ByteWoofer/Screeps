var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.dest){
            var destination = creep.memory.dest.getObjectById; // load destination from memory
        } else {
            creep.memory.task = '';
        }
        creep.say(creep.memory.task);
        
        switch(creep.memory.task){
            case "request":
                destination = ""; 
                var sources = creep.room.find(FIND_SOURCES); //list sources
                for (i = 0; i< sources.length; i++){         //iterate over sources
                    if(sources[i].memory.users < 1){         //check for available spot
                        sources[i].memory.users++;
                        destination = sources[i];
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
                destination = Game.flags['Flag1'];
                creep.memory.task = "flag";
            break;

            case "flag": //Determine distance to flag and progress if outside
                if(Math.sqrt((Math.pow((creep.pos.x-destination.pos.x),2)+Math.pow((creep.pos.y-destination.pos.y),2)))>5) {
                    creep.moveTo(destination, {visualizePathStyle: {stroke: '#ffffff'}}); //move towards if over 5 away
                } else {
                    creep.memory.task = "request"; //request new task
                }
            break;

            case "harvest": //progress to destination and harvest if energy is not full
                if(creep.energy<creep.energyCapacity){
                    if(creep.harvest() == ERR_NOT_IN_RANGE) {
                        creep.moveTo(destination);
                    }
                } else {
                    destination.memory.users--;
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
        creep.memory.dest = destination.id;
    }
};

module.exports = roleHarvester;