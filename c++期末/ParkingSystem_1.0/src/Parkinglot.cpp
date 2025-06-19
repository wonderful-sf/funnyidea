#include "../include/Parkinglot.h"
#include <iostream>
ParkingLot::ParkingLot(int totalSpace,double fee){
    this->totalSpace = totalSpace;
    this->availableSpace = totalSpace;
    this->fee = fee;
}
void ParkingLot::entryParkingLot(const Vehicle &v){
    if(availableSpace == 0){
        std::cout << "FULL"  << std::endl;
    }else{
        packedVehicles.push_back(v);
        availableSpace--;
        std::cout << v.getPlateNumber() << " Entry" << std::endl;
    }
}
void ParkingLot::exitParkingLot(std::string plateNumber,Time exitTime){
    bool found = false;
    Vehicle v;
    for(auto it = packedVehicles.begin();it != packedVehicles.end();it++){
        if(it->getPlateNumber() == plateNumber){
            it->setExitTime(exitTime);
            v = *it;
            found = true;
            break;
        }
    }
    if(!found) {
        std::cout << "NOT FIND" << plateNumber  << std::endl;
        return;
    }
    std::cout<<"PlateNunber: "<<v.getPlateNumber()<<std::endl;
    std::cout<<"EntryTIme: ";
    v.getEntryTime().show();
    std::cout<<"ExitTime: ";
    v.getExitTime().show();
    std::cout<<"Fee: "<<calculateFee(v)<<"YUAN"<<std::endl;
    packedVehicles.remove(v);
    availableSpace++; 
}
double ParkingLot::calculateFee(const Vehicle &v) const{
    int gap = v.getEntryTime().getTotalMinutes(v.getExitTime());
    double fee = gap * this->fee;
    return fee;
}
