#ifndef PARKINGLOT_H
#define PARKINGLOT_H
#include <list>
#include "Vehicle.h"
class ParkingLot{
    private:
        int totalSpace;
        int availableSpace;
        std::list<Vehicle> packedVehicles;
        double fee;
    public:
        ParkingLot(int totalSpace,double fee);
        int getTotalSpace() const{return totalSpace;};
        int getAvailableSpace() const{return availableSpace;};
        void entryParkingLot(const Vehicle &v);
        void exitParkingLot(std ::string plateNumber,Time exitTime) ;
        double calculateFee(const Vehicle &v) const;
        void setFee(double fee);
        void packVehicle(const Vehicle &v);
};
#endif