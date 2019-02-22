var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            Memory.sourceInUse[creep.memory.index] = false;
            delete creep.memory.index;
            delete creep.memory.dest;
            creep.memory.building = true;
            creep.say('build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var index = 0;
            var found = false;
            if(!creep.memory.dest){
                for (sourceUse in Memory.sourceInUse) {
                    if (!sourceUse) {
                        creep.memory.dest = sources[index].id;
                        Memory.sourceInUse[index]=true;
                        creep.memory.index = index;
                        break;
                    }
                    index + 1;
                }
                if (found = false) {
                    creep.memory.dest = Game.flags['Wait'].id;
                }
            }
            var dest = Game.getObjectById(creep.memory.dest);
            if(dest.name == 'Wait' && creep.pos == dest.constructor.name){
                delete creep.memory.dest;
            } else {
                if(creep.harvest(dest) != OK){
                    creep.moveTo(dest), { visualizePathStyle: { stroke: '#ffaa00' } };
                }
            }
        }
    }
};

module.exports = roleBuilder;