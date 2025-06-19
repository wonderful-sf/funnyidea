#ifndef VEHICLE_H
#define VEHICLE_H
#include "Time.h"
#include <string>
class Vehicle {
private:
    std::string plateNumber;
    Time entryTime;
    Time exitTime;
public:
    Vehicle(std::string plateNumber = "", Time entryT = Time());
    ~Vehicle(){};
    std::string getPlateNumber() const {return plateNumber;}; 
    Time getEntryTime() const{return entryTime;};
    Time getExitTime() const {return exitTime;};
    void setExitTime(Time exitTime);
    bool operator==(const Vehicle& other) const {
        return plateNumber == other.plateNumber;
    }
};
#endif