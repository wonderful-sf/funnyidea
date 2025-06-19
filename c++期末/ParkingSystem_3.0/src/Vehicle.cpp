#include "../include/Vehicle.h"

Vehicle::Vehicle(std::string plateNumber, Time entryTime)
    : plateNumber(plateNumber), entryTime(entryTime), ownerUsername("") {
}

Vehicle::Vehicle(std::string plateNumber, Time entryTime, std::string ownerUsername)
    : plateNumber(plateNumber), entryTime(entryTime), ownerUsername(ownerUsername) {
}

std::string Vehicle::getPlateNumber() const {
    return plateNumber;
}

Time Vehicle::getEntryTime() const {
    return entryTime;
}

Time Vehicle::getExitTime() const {
    return exitTime;
}

void Vehicle::setExitTime(Time exitTime) {
    this->exitTime = exitTime;
}

std::string Vehicle::getOwnerUsername() const {
    return ownerUsername;
}

void Vehicle::setOwnerUsername(const std::string& username) {
    ownerUsername = username;
}
