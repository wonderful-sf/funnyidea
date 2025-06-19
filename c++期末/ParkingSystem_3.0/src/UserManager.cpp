#include "../include/UserManager.h"
#include <fstream>
#include <iostream>
#include <sstream>
#include <direct.h>
#include <errno.h>
#include <string.h>

UserManager::UserManager() : currentUser(nullptr) {
    loadUsers();
}

UserManager::~UserManager() {
    saveUsers();
}

std::string UserManager::getUserDataPath() const {
    // 直接使用当前目录
    std::string userDataPath = ".";
    std::cout << "使用当前目录存储用户数据" << std::endl;
    
    std::string fullPath = userDataPath + "\\users.txt";
    std::cout << "用户数据文件路径: " << fullPath << std::endl;
    

    return fullPath;
}

void UserManager::loadUsers() {
    // 从文件加载用户数据
    std::string filePath = this->getUserDataPath();
    std::ifstream file(filePath);
        // 检查文件是否存在，如果不存在则创建空文件
    std::ifstream checkFile(filePath);
    if (!checkFile) {
        std::cout << "用户数据文件不存在，将创建新文件" << std::endl;
        users.push_back(std::make_shared<AdminUser>("admin", "admin123"));
        std::cout << "成功默认创建管理员用户admin，默认密码admin123" << std::endl;
        std::ofstream createFile(filePath);
        saveUsers();
        if (createFile) {
            std::cout << "成功创建用户数据文件" << std::endl;
            createFile.close();
        } else {
            std::cerr << "创建用户数据文件失败" << std::endl;
        }
    } else {
         checkFile.close();
    }
        
  
    try {
        std::string line;
        while (std::getline(file, line)) {
            std::istringstream iss(line);
            std::string userType, username, password;
            
            if (!(iss >> userType >> username >> password)) {
                std::cerr << "警告：跳过格式不正确的行: " << line << std::endl;
                continue; // 跳过格式不正确的行
            }
            
            if (userType == "Admin") {
                users.push_back(std::make_shared<AdminUser>(username, password));
                std::cout << "已加载管理员用户: " << username << std::endl;
            } else if (userType == "Guest") {
                users.push_back(std::make_shared<GuestUser>(username, password));
                std::cout << "已加载访客用户: " << username << std::endl;
            } else if (userType == "Monthly" || userType == "Yearly") {
                std::string expiryDate;
                if (!(iss >> expiryDate)) {
                    std::cerr << "警告：VIP用户缺少到期日期，跳过: " << line << std::endl;
                    continue; // 跳过格式不正确的行
                }
                
                if (userType == "Monthly") {
                    users.push_back(std::make_shared<MonthlyUser>(username, password, expiryDate));
                    std::cout << "已加载月卡用户: " << username << "，到期日期: " << expiryDate << std::endl;
                } else {
                    users.push_back(std::make_shared<YearlyUser>(username, password, expiryDate));
                    std::cout << "已加载年卡用户: " << username << "，到期日期: " << expiryDate << std::endl;
                }
            } else {
                std::cerr << "警告：未知用户类型: " << userType << "，跳过" << std::endl;
            }
        }
        
        file.close();
        std::cout << "成功从文件加载了 " << users.size() << " 个用户" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "加载用户数据时发生错误：" << e.what() << std::endl;
        if (users.empty()) {
            auto admin = std::make_shared<AdminUser>("admin", "admin123");
            users.push_back(admin);
            std::cout << "由于加载错误，已创建默认管理员账户" << std::endl;
        }
    }
}

void UserManager::saveUsers() const {
    // 保存用户数据到文件
    std::string filePath = this->getUserDataPath();
    std::ofstream file(filePath);
    if (!file) {
        std::cerr << "无法保存用户数据到文件：" << filePath << std::endl;
        return;
    }
    
    try {
        for (const auto& user : users) {
            if (user->getUserType() == "Admin") {
                file << "Admin " << user->getUsername() << " " << user->getPassword() << std::endl;
            } else if (user->getUserType() == "Guest") {
                file << "Guest " << user->getUsername() << " " << user->getPassword() << std::endl;
            } else if (user->getUserType() == "VIP") {
                auto vipUser = std::dynamic_pointer_cast<VipUser>(user);
                if (vipUser) {
                    file << vipUser->getCardType() << " " << vipUser->getUsername() << " " 
                         << vipUser->getPassword() << " " << vipUser->getExpiryDate() << std::endl;
                }
            }
        }
        
        file.close();
        std::cout << "用户数据已成功保存到文件：" << filePath << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "保存用户数据时发生错误：" << e.what() << std::endl;
    }
}

bool UserManager::registerUser(const std::string& username, const std::string& password, const std::string& userType) {
    // 检查用户名是否已存在
    for (const auto& user : users) {
        if (user->getUsername() == username) {
            return false; // 用户名已存在
        }
    }
    
    // 创建新用户
    if (userType == "Admin") {
        users.push_back(std::make_shared<AdminUser>(username, password));
    } else if (userType == "Guest") {
        users.push_back(std::make_shared<GuestUser>(username, password));
    }
    
    saveUsers(); // 保存用户数据
    return true;
}

bool UserManager::login(const std::string& username, const std::string& password) {
    for (const auto& user : users) {
        if (user->getUsername() == username && user->verifyPassword(password)) {
            currentUser = user;
            return true;
        }
    }
    return false;
}

void UserManager::logout() {
    currentUser = nullptr;
}

std::shared_ptr<User> UserManager::getCurrentUser() const {
    return currentUser;
}

bool UserManager::isLoggedIn() const {
    return currentUser != nullptr;
}

std::shared_ptr<User> UserManager::createGuestUser(const std::string& plateNumber) {
    // 创建临时访客账户，使用车牌号作为账号
    std::string username = plateNumber.empty() ? "guest" + std::to_string(rand() % 10000) : plateNumber;
    std::string password = "123456"; // 默认密码
    
    // 检查用户名是否已存在
    for (const auto& user : users) {
        if (user->getUsername() == username) {
            // 如果用户已存在，直接登录
            currentUser = user;
            return user;
        }
    }
    
    // 创建新访客用户
    auto guest = std::make_shared<GuestUser>(username, password);
    users.push_back(guest);
    currentUser = guest;
    
    // 保存用户数据到文件
    saveUsers();
    
    return guest;
}

bool UserManager::createVipUser(const std::string& username, const std::string& password, 
                               const std::string& cardType, const std::string& expiryDate) {
    // 检查用户名是否已存在
    for (const auto& user : users) {
        if (user->getUsername() == username) {
            return false; // 用户名已存在
        }
    }
    
    // 创建VIP用户
    if (cardType == "Monthly") {
        users.push_back(std::make_shared<MonthlyUser>(username, password, expiryDate));
    } else if (cardType == "Yearly") {
        users.push_back(std::make_shared<YearlyUser>(username, password, expiryDate));
    } else {
        return false; // 无效的卡类型
    }
    
    saveUsers(); // 保存用户数据
    return true;
}

std::shared_ptr<User> UserManager::findUser(const std::string& username) const {
    for (const auto& user : users) {
        if (user->getUsername() == username) {
            return user;
        }
    }
    return nullptr;
}

const std::vector<std::shared_ptr<User>>& UserManager::getAllUsers() const {
    return users;
}