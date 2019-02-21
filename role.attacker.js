/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */
var roleAttacker = {
    run: function(creep){
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE){
                creep.moveTo(closetHostile);
            }
        }
    }
}
module.exports = roleAttacker;