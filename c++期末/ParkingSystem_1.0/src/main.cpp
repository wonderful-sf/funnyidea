#include "../include/Parkinglot.h"
int main(){
    ParkingLot parkingLot(10,10);
    Vehicle v1("123456",Time(2025,5,23,12,19,20));
    parkingLot.entryParkingLot(v1);
    parkingLot.exitParkingLot("123456",Time(2025,5,23,12,20,20));
    return 0;
}
