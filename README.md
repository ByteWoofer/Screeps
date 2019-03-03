# Screeps
This is the current code integrated into my Screeps colony.

#WaitNGo
The idea of Wait N Go protocol is based on each source only having the availability of N spots (Currently 1). The creeps will proceed to a wait point then N creeps will be selected to collect energy adding themselves to the occupation of the source. When a creep is full on energy it removes itself from the source.

#Creep memory design:
    Task variable
    Target variable

#Source memory design:
    array of (current user count) for each flag
    This can be handled by storing the object ID of the creep using it.

#Creep state diagram:

Spawn:
    Task -> Goto wait flag

At Flag:
    Request permission

Permission Granted:
    Set user count on selected source +1
    set task to collect
    set target to source

Permission Denied:
    goto At Flag:

Harvested Full energy:
    Task -> Deposit
    Target -> spawner
    Current Count--

Deposited energy:
    Goto Wait flag:

##Game tick diagram.
    Creep:
        Harvester:
            iterate through creeps:
                Task Doesn't exist:
                    Set task(Request permission)

                Task (Request permission):
                    for list of sources:
                        if source has open spot
                            set spot to creepID 
                            set job to GoHarvest
                            set target to source
                        else
                            next
                    if none found:
                        set task(Goto Flag)

                Task (Goto flag):
                    if not at flag:
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    else
                        Set task(Request Permission)

                Task (GoHarvest):
                    if not full on energy:
                        if at source:
                            harvest
                        else:
                            Move to targeted source                
                    else:
                        remove from memory of source
                        set job to Deposit
                        set target for Spawner to deposit at

                Task (Deposit):              
                    If energy not empty:
                        If not at deposit target:
                            move to deposit target
                        else
                            deposit energy
                    else
                        set job to Goto Flag


    Spawn: