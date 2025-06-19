#include "../include/Parkinglot.h"
#include <iostream>
#include <algorithm>

ParkingLot::ParkingLot(int totalSpace, double fee) {
    this->totalSpace = totalSpace;
    this->availableSpace = totalSpace;
    this->fee = fee;
}

bool ParkingLot::entryParkingLot(Vehicle v) {
    if (availableSpace <= 0) {
        std::cout << "停车场已满，无法停车！" << std::endl;
        return false;
    }
    
    // 检查车辆是否已经在停车场内
    if (findVehicle(v.getPlateNumber())) {
        std::cout << "车辆 " << v.getPlateNumber() << " 已经在停车场内！" << std::endl;
        return false;
    }
    
    vehicles.push_back(v);
    availableSpace--;
    std::cout << "车辆 " << v.getPlateNumber() << " 已进入停车场。" << std::endl;
    return true;
}

bool ParkingLot::exitParkingLot(std::string plateNumber, Time exitTime) {
    auto it = std::find_if(vehicles.begin(), vehicles.end(),
                          [&plateNumber](const Vehicle& v) { return v.getPlateNumber() == plateNumber; });
    
    if (it == vehicles.end()) {
        std::cout << "未找到车牌号为 " << plateNumber << " 的车辆！" << std::endl;
        return false;
    }
    
    // 设置出场时间
    it->setExitTime(exitTime);
    
    // 显示车辆信息和费用
    std::cout << "===== 车辆出场信息 =====" << std::endl;
    std::cout << "车牌号: " << it->getPlateNumber() << std::endl;
    std::cout << "入场时间: ";
    it->getEntryTime().show();
    std::cout<<std::endl;
    std::cout << "出场时间: ";
    exitTime.show();
    std::cout<<std::endl;

    
    // 计算费用
    double fee = calculateFee(it->getEntryTime(), exitTime);
    
    // 如果有关联用户，应用用户折扣
    std::string ownerUsername = it->getOwnerUsername();
    if (!ownerUsername.empty()) {
        // 这里应该从UserManager获取用户信息并计算折扣
        // 由于UserManager是在Menu类中管理的，这里简化处理
        std::cout << "车主: " << ownerUsername << std::endl;
    }
    
    std::cout << "停车费用: " << fee << " 元" << std::endl;
    
    // 移除车辆并更新可用车位
    vehicles.erase(it);
    availableSpace++;
    
    return true;
}

double ParkingLot::calculateFee(Time entryTime, Time exitTime) {
    int minutes = entryTime.getTotalMinutes(exitTime);
    return minutes * fee;
}

double ParkingLot::calculateFee(Time entryTime, Time exitTime, std::shared_ptr<User> user) {
    // 基本费用
    double baseFee = calculateFee(entryTime, exitTime);
    
    // 根据用户类型应用折扣
    if (user) {
        return user->calculateParkingFee(baseFee);
    }
    
    return baseFee;
}

int ParkingLot::getTotalSpace() const {
    return totalSpace;
}

int ParkingLot::getAvailableSpace() const {
    return availableSpace;
}

double ParkingLot::getFee() const {
    return fee;
}

void ParkingLot::setFee(double newFee) {
    if (newFee >= 0) {
        fee = newFee;
    }
}

bool ParkingLot::findVehicle(const std::string& plateNumber) const {
    return std::any_of(vehicles.begin(), vehicles.end(),
                      [&plateNumber](const Vehicle& v) { return v.getPlateNumber() == plateNumber; });
}

Vehicle* ParkingLot::getVehicle(const std::string& plateNumber) {
    auto it = std::find_if(vehicles.begin(), vehicles.end(),
                          [&plateNumber](const Vehicle& v) { return v.getPlateNumber() == plateNumber; });
    
    if (it != vehicles.end()) {
        return &(*it);
    }
    
    return nullptr;
}
