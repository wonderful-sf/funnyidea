#ifndef MENU_H
#define MENU_H

#include "Parkinglot.h"
#include "UserManager.h"
#include <memory>

class Menu {
private:
    std::shared_ptr<ParkingLot> parkingLot;
    std::shared_ptr<UserManager> userManager;
    
    // 显示主菜单
    void showMainMenu() const;
    
    // 显示管理员菜单
    void showAdminMenu() const;
    
    // 显示VIP用户菜单
    void showVipMenu() const;
    
    // 显示临时访客菜单
    void showGuestMenu() const;
    
    // 处理用户登录
    void handleLogin();
    
    // 处理用户注册
    void handleRegister();
    
    // 处理临时访客登录
    void handleGuestLogin();
    
    // 处理车辆进入停车场
    void handleVehicleEntry();
    
    // 处理车辆离开停车场
    void handleVehicleExit();
    
    // 处理查看停车场状态
    void handleViewParkingStatus() const;
    
    // 处理管理员设置停车费率
    void handleSetParkingFee();
    
    // 处理管理员查看所有用户
    void handleViewAllUsers() const;
    
    // 处理创建VIP用户
    void handleCreateVipUser();
    
public:
    Menu();
    
    // 运行菜单系统
    void run();
};

#endif // MENU_H