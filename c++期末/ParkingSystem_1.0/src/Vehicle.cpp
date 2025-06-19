#include "../include/Vehicle.h"
Vehicle::Vehicle(std::string plateNumber,Time eTime):plateNumber(plateNumber),entryTime(eTime){
}
void Vehicle::setExitTime(Time eTime){
    exitTime = eTime;
}
