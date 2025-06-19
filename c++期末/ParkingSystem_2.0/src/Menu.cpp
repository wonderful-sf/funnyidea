#include "../include/Menu.h"
#include <iostream>

#include <limits>
#include <string>

Menu::Menu() {
    // 初始化停车场和用户管理器
    parkingLot = std::make_shared<ParkingLot>(50, 2.0); // 默认50个车位，每分钟2元
    userManager = std::make_shared<UserManager>();
}

void Menu::run() {
    int choice = 0;
    bool exit = false;
    
    // 确保控制台正确初始化
    std::cout << "\n欢迎使用停车场管理系统！\n" << std::endl;
    
    while (!exit) {
        // 根据用户类型显示不同的菜单
        if (!userManager->isLoggedIn()) {
            showMainMenu();
        } else {
            auto currentUser = userManager->getCurrentUser();
            std::string userType = currentUser->getUserType();
            
            if (userType == "Admin") {
                showAdminMenu();
            } else if (userType == "VIP") {
                showVipMenu();
            } else {
                showGuestMenu();
            }
        }
        
        std::cout << "请选择一个操作: ";
        std::cin >> choice;
        
        // 清除输入缓冲区
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
        // 根据用户选择执行相应操作
        if (!userManager->isLoggedIn()) {
            // 主菜单选项
            switch (choice) {
                case 1:
                    handleLogin();
                    break;
                case 2:
                    handleRegister();
                    break;
                case 3:
                    handleGuestLogin();
                    break;
                case 4:
                    exit = true;
                    break;
                default:
                    std::cout << "无效选择，请重试！" << std::endl;
            }
        } else {
            auto currentUser = userManager->getCurrentUser();
            std::string userType = currentUser->getUserType();
            
            if (userType == "Admin") {
                // 管理员菜单选项
                switch (choice) {
                    case 1:
                        handleViewParkingStatus();
                        break;
                    case 2:
                        handleSetParkingFee();
                        break;
                    case 3:
                        handleViewAllUsers();
                        break;
                    case 4:
                        handleCreateVipUser();
                        break;
                    case 5:
                        handleVehicleEntry();
                        break;
                    case 6:
                        handleVehicleExit();
                        break;
                    case 7:
                        userManager->logout();
                        std::cout << "已退出系统登录！" << std::endl;
                        break;
                    case 8:
                        exit = true;
                        break;
                    default:
                        std::cout << "无效选择，请重试！" << std::endl;
                }
            } else if (userType == "VIP") {
                // VIP用户菜单选项
                switch (choice) {
                    case 1:
                        handleViewParkingStatus();
                        break;
                    case 2:
                        handleVehicleEntry();
                        break;
                    case 3:
                        handleVehicleExit();
                        break;
                    case 4:
                        userManager->logout();
                        std::cout << "已退出系统登录！" << std::endl;
                        break;
                    case 5:
                        exit = true;
                        break;
                    default:
                        std::cout << "无效选择，请重试！" << std::endl;
                }
            } else {
                // 临时访客菜单选项
                switch (choice) {
                    case 1:
                        handleViewParkingStatus();
                        break;
                    case 2:
                        handleVehicleEntry();
                        break;
                    case 3:
                        handleVehicleExit();
                        break;
                    case 4:
                        userManager->logout();
                        std::cout << "已退出系统登录！" << std::endl;
                        break;
                    case 5:
                        exit = true;
                        break;
                    default:
                        std::cout << "无效选择，请重试！" << std::endl;
                }
            }
        }
        
        std::cout << std::endl;
    }
    
    std::cout << "感谢使用停车场管理系统，再见！" << std::endl;
}

void Menu::showMainMenu() const {
    std::cout << "===== 停车场管理系统 =====" << std::endl;
    std::cout << "1. 用户登录" << std::endl;
    std::cout << "2. 用户注册" << std::endl;
    std::cout << "3. 访客登录" << std::endl;
    std::cout << "4. 退出系统" << std::endl;
}

void Menu::showAdminMenu() const {
    std::cout << "===== 管理员菜单 =====" << std::endl;
    std::cout << "当前用户: " << userManager->getCurrentUser()->getUsername() << " (管理员)" << std::endl;
    std::cout << "1. 查看停车场状态" << std::endl;
    std::cout << "2. 设置停车费率" << std::endl;
    std::cout << "3. 查看所有用户" << std::endl;
    std::cout << "4. 创建VIP用户" << std::endl;
    std::cout << "5. 车辆入场" << std::endl;
    std::cout << "6. 车辆出场" << std::endl;
    std::cout << "7. 退出登录" << std::endl;
    std::cout << "8. 退出系统" << std::endl;
}

void Menu::showVipMenu() const {
    auto vipUser = std::dynamic_pointer_cast<VipUser>(userManager->getCurrentUser());
    std::cout << "===== VIP用户菜单 =====" << std::endl;
    std::cout << "当前用户: " << vipUser->getUsername() << " (" << vipUser->getCardType() << "卡用户)" << std::endl;
    std::cout << "到期日期: " << vipUser->getExpiryDate() << std::endl;
    std::cout << "1. 查看停车场状态" << std::endl;
    std::cout << "2. 车辆入场" << std::endl;
    std::cout << "3. 车辆出场" << std::endl;
    std::cout << "4. 退出登录" << std::endl;
    std::cout << "5. 退出系统" << std::endl;
}

void Menu::showGuestMenu() const {
    std::cout << "===== 访客菜单 =====" << std::endl;
    std::cout << "当前用户: " << userManager->getCurrentUser()->getUsername() << " (访客)" << std::endl;
    std::cout << "1. 查看停车场状态" << std::endl;
    std::cout << "2. 车辆入场" << std::endl;
    std::cout << "3. 车辆出场" << std::endl;
    std::cout << "4. 退出登录" << std::endl;
    std::cout << "5. 退出系统" << std::endl;
}

void Menu::handleLogin() {
    std::string username, password;
    int attempts = 0;
    const int maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        std::cout << "请输入用户名: ";
        std::getline(std::cin, username);
        
        if (username.empty()) {
            std::cout << "错误：用户名不能为空！" << std::endl;
            continue;
        }
        
        std::cout << "请输入密码: ";
        std::getline(std::cin, password);
        
        if (password.empty()) {
            std::cout << "错误：密码不能为空！" << std::endl;
            continue;
        }
        
        if (userManager->login(username, password)) {
            std::cout << "登录成功！欢迎 " << username << "！" << std::endl;
            return;
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                std::cout << "登录失败！用户名或密码不正确。还有" << (maxAttempts - attempts) << "次尝试机会。" << std::endl;
            } else {
                std::cout << "登录失败！已达到最大尝试次数。" << std::endl;
            }
        }
    }
}

void Menu::handleRegister() {
    std::string username, password;
    bool validInput = false;
    
    while (!validInput) {
        std::cout << "请输入用户名 (至少3个字符): ";
        std::getline(std::cin, username);
        
        if (username.empty()) {
            std::cout << "错误：用户名不能为空！" << std::endl;
            continue;
        }
        
        if (username.length() < 3) {
            std::cout << "错误：用户名长度至少为3个字符！" << std::endl;
            continue;
        }
        
        std::cout << "请输入密码 (至少6个字符): ";
        std::getline(std::cin, password);
        
        if (password.empty()) {
            std::cout << "错误：密码不能为空！" << std::endl;
            continue;
        }
        
        if (password.length() < 6) {
            std::cout << "错误：密码长度至少为6个字符！" << std::endl;
            continue;
        }
        
        validInput = true;
    }
    
    if (userManager->registerUser(username, password, "Guest")) {
        std::cout << "注册成功！请登录。" << std::endl;
    } else {
        std::cout << "注册失败！用户名已存在。" << std::endl;
    }
}

void Menu::handleGuestLogin() {
    std::string plateNumber;
    
    std::cout << "请输入车牌号作为访客账号: ";
    std::getline(std::cin, plateNumber);
    
    if (plateNumber.empty()) {
        std::cout << "车牌号不能为空，将使用随机访客ID" << std::endl;
    }
    
    auto guest = userManager->createGuestUser(plateNumber);
    std::cout << "访客登录成功！您的账号是: " << guest->getUsername() << "，默认密码: 123456" << std::endl;
}

void Menu::handleVehicleEntry() {
    std::string plateNumber;
    int year, month, day, hour, minute, second;

    std::cout << "请输入车牌号: ";
    std::getline(std::cin, plateNumber);

    std::cout << "请输入入场年份: ";
    std::cin >> year;
    std::cout << "请输入入场月份: ";
    std::cin >> month;
    std::cout << "请输入入场日期: ";
    std::cin >> day;
    std::cout << "请输入入场小时: ";
    std::cin >> hour;
    std::cout << "请输入入场分钟: ";
    std::cin >> minute;
    std::cout << "请输入入场秒数: ";
    std::cin >> second;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 清除换行符

    Time entryTime(year, month, day, hour, minute, second);
    
    std::string ownerUsername = "";
    if (userManager->isLoggedIn()) {
        ownerUsername = userManager->getCurrentUser()->getUsername();
    }

    Vehicle vehicle(plateNumber, entryTime, ownerUsername);
    if (parkingLot->entryParkingLot(vehicle)) {
        if (!ownerUsername.empty()) {
            std::cout << "车辆 " << plateNumber << " 已关联到用户 " << ownerUsername << std::endl;
        }
    }
}

void Menu::handleVehicleExit() {
    std::string plateNumber;
    int year, month, day, hour, minute, second;

    std::cout << "请输入车牌号: ";
    std::getline(std::cin, plateNumber);

    // 检查车辆是否存在
    Vehicle* vehicle = parkingLot->getVehicle(plateNumber);
    if (!vehicle) {
        std::cout << "未找到车牌号为 " << plateNumber << " 的车辆！" << std::endl;
        return;
    }

    // 权限检查
    if (!userManager->isLoggedIn()) {
        std::cout << "请先登录系统！" << std::endl;
        return;
    }
    
    std::shared_ptr<User> currentUser = userManager->getCurrentUser();
    std::string vehicleOwner = vehicle->getOwnerUsername();

    if (currentUser->getUserType() != "Admin" && currentUser->getUsername() != vehicleOwner) {
        std::cout << "权限不足！您只能操作自己名下的车辆。" << std::endl;
        return;
    }

    std::cout << "请输入离场年份: ";
    std::cin >> year;
    std::cout << "请输入离场月份: ";
    std::cin >> month;
    std::cout << "请输入离场日期: ";
    std::cin >> day;
    std::cout << "请输入离场小时: ";
    std::cin >> hour;
    std::cout << "请输入离场分钟: ";
    std::cin >> minute;
    std::cout << "请输入离场秒数: ";
    std::cin >> second;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 清除换行符

    Time exitTime(year, month, day, hour, minute, second);
    
    parkingLot->exitParkingLot(plateNumber, exitTime);
}

void Menu::handleViewParkingStatus() const {
    std::cout << "===== 停车场状态 =====" << std::endl;
    std::cout << "总车位数: " << parkingLot->getTotalSpace() << std::endl;
    std::cout << "可用车位数: " << parkingLot->getAvailableSpace() << std::endl;
    std::cout << "已占用车位数: " << (parkingLot->getTotalSpace() - parkingLot->getAvailableSpace()) << std::endl;

    std::cout << "\n===== 场内车辆信息 =====" << std::endl;
    auto currentUser = userManager->getCurrentUser();
    bool isAdmin = false;
    if (currentUser) {
        isAdmin = (currentUser->getUserType() == "Admin");
    }

    const auto& vehicles = parkingLot->getAllVehicles(); // 假设ParkingLot有getAllVehicles方法
    if (vehicles.empty()) {
        std::cout << "停车场内暂无车辆。" << std::endl;
    } else {
        auto pad = [](const std::string& s, int width) {
    return s + std::string(width > s.size() ? width - s.size() : 0, ' ');
};
std::cout << pad("车牌号", 15)
          << pad("入场时间", 25)
          << pad("所有者", 15) << std::endl;
        std::cout << std::string(55, '-') << std::endl;

        for (const auto& vehicle : vehicles) {
            if (isAdmin || (currentUser && vehicle.getOwnerUsername() == currentUser->getUsername())) {
                std::cout << pad(vehicle.getPlateNumber(), 15);
                char buffer[80];
                vehicle.getEntryTime().show(); 
                std::cout << pad(vehicle.getOwnerUsername(), 15) << std::endl;
            }
        }
    }
}

void Menu::handleSetParkingFee() {
    double fee;
    
    std::cout << "请输入新的停车费率（元/分钟）: ";
    std::cin >> fee;
    
    // 清除输入缓冲区
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    
    if (fee >= 0) {
        parkingLot->setFee(fee);
        std::cout << "停车费率已更新为 " << fee << " 元/分钟。" << std::endl;
    } else {
        std::cout << "无效的费率！请输入非负数。" << std::endl;
    }
}

// handleViewAllUsers函数已在前面定义

void Menu::handleCreateVipUser() {
    std::string username, password, cardType, expiryDate;
    bool validInput = false;
    
    while (!validInput) {
        std::cout << "请输入用户名 (至少3个字符): ";
        std::getline(std::cin, username);
        
        if (username.empty()) {
            std::cout << "错误：用户名不能为空！" << std::endl;
            continue;
        }
        
        if (username.length() < 3) {
            std::cout << "错误：用户名长度至少为3个字符！" << std::endl;
            continue;
        }
        
        std::cout << "请输入密码 (至少6个字符): ";
        std::getline(std::cin, password);
        
        if (password.empty()) {
            std::cout << "错误：密码不能为空！" << std::endl;
            continue;
        }
        
        if (password.length() < 6) {
            std::cout << "错误：密码长度至少为6个字符！" << std::endl;
            continue;
        }
        
        bool validCardType = false;
        while (!validCardType) {
            std::cout << "请选择卡类型 (1: 月卡 Monthly, 2: 年卡 Yearly): ";
            std::getline(std::cin, cardType);
            
            if (cardType == "1" || cardType.compare("月卡") == 0 || cardType.compare("Monthly") == 0) {
                cardType = "Monthly";
                validCardType = true;
            } else if (cardType == "2" || cardType.compare("年卡") == 0 || cardType.compare("Yearly") == 0) {
                cardType = "Yearly";
                validCardType = true;
            } else {
                std::cout << "错误：无效的卡类型！请选择月卡或年卡。" << std::endl;
            }
        }
        
        bool validDate = false;
        while (!validDate) {
            std::cout << "请输入到期日期（格式：YYYY-MM-DD）: ";
            std::getline(std::cin, expiryDate);
            
            // 简单验证日期格式
            if (expiryDate.length() != 10 || expiryDate[4] != '-' || expiryDate[7] != '-') {
                std::cout << "错误：日期格式不正确！请使用YYYY-MM-DD格式。" << std::endl;
                continue;
            }
            
            try {
                int year = std::stoi(expiryDate.substr(0, 4));
                int month = std::stoi(expiryDate.substr(5, 2));
                int day = std::stoi(expiryDate.substr(8, 2));
                
                if (year < 2023 || month < 1 || month > 12 || day < 1 || day > 31) {
                    std::cout << "错误：无效的日期！" << std::endl;
                    continue;
                }
                
                validDate = true;
            } catch (const std::exception& e) {
                std::cout << "错误：日期格式不正确！" << std::endl;
            }
        }
        
        validInput = true;
    }
    
    if (userManager->createVipUser(username, password, cardType, expiryDate)) {
        std::cout << "VIP用户创建成功！" << std::endl;
    } else {
        std::cout << "创建VIP用户失败！用户名已存在。" << std::endl;
    }
}

// handleViewAllUsers函数已在前面定义

void Menu::handleViewAllUsers() const {
    const auto& users = userManager->getAllUsers();
    
    std::cout << "===== 用户列表 =====" << std::endl;
    std::cout << "总用户数: " << users.size() << std::endl;
    
    for (const auto& user : users) {
        std::cout << "用户名: " << user->getUsername() << ", 类型: " << user->getUserType();
        
        if (user->getUserType() == "VIP") {
            auto vipUser = std::dynamic_pointer_cast<VipUser>(user);
            if (vipUser) {
                std::cout << " (" << vipUser->getCardType() << "卡, 到期日期: " << vipUser->getExpiryDate() << ")";
            }
        }
        
        std::cout << std::endl;
    }
}