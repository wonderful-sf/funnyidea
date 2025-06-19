#ifndef PARKINGLOT_H
#define PARKINGLOT_H
#include <vector>
#include <memory>
#include <string>
#include "Vehicle.h"
#include "User.h"

class ParkingLot {
private:
    int totalSpace;
    int availableSpace;
    double fee; // 基本费率（元/分钟）
    std::vector<Vehicle> vehicles;
    
public:
    ParkingLot(int totalSpace, double fee);
    
    // 车辆进出停车场
    bool entryParkingLot(Vehicle v);
    bool exitParkingLot(std::string plateNumber, Time exitTime);
    
    // 计算停车费用，考虑用户类型
    double calculateFee(Time entryTime, Time exitTime);
    double calculateFee(Time entryTime, Time exitTime, std::shared_ptr<User> user);
    
    // 获取停车场信息
    int getTotalSpace() const;
    int getAvailableSpace() const;
    double getFee() const;
    void setFee(double newFee);
    
    // 查找车辆
    bool findVehicle(const std::string& plateNumber) const;
    Vehicle* getVehicle(const std::string& plateNumber);

    // 获取所有车辆信息
    const std::vector<Vehicle>& getAllVehicles() const { return vehicles; }
};
#endif