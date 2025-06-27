#ifndef VEHICLE_H
#define VEHICLE_H
#include <string>
#include <memory>
#include "Time.h"

// 前向声明User类，避免循环引用
class User;

class Vehicle {
private:
    std::string plateNumber;
    Time entryTime;
    Time exitTime;
    std::string ownerUsername; // 车主用户名
    
public:
    Vehicle(std::string plateNumber, Time entryTime);
    Vehicle(std::string plateNumber, Time entryTime, std::string ownerUsername);
    
    std::string getPlateNumber() const;
    Time getEntryTime() const;
    Time getExitTime() const;
    void setExitTime(Time exitTime);
    
    // 获取和设置车主用户名
    std::string getOwnerUsername() const;
    void setOwnerUsername(const std::string& username);
};
#endif