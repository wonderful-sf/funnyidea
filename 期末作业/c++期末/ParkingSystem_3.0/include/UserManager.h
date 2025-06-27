#ifndef USER_MANAGER_H
#define USER_MANAGER_H

#include <vector>
#include <memory>
#include "User.h"

class UserManager {
private:
    std::vector<std::shared_ptr<User>> users;
    std::shared_ptr<User> currentUser;
    
    // 获取用户数据文件路径
    std::string getUserDataPath() const;
    
    // 从文件加载用户数据
    void loadUsers();
    
    // 保存用户数据到文件
    void saveUsers() const;

public:
    UserManager();
    ~UserManager();
    
    // 用户注册
    bool registerUser(const std::string& username, const std::string& password, const std::string& userType);
    
    // 用户登录
    bool login(const std::string& username, const std::string& password);
    
    // 用户登出
    void logout();
    
    // 获取当前登录用户
    std::shared_ptr<User> getCurrentUser() const;
    
    // 检查用户是否已登录
    bool isLoggedIn() const;
    
    // 创建临时访客账户，使用车牌号作为账号，默认密码为123456
    std::shared_ptr<User> createGuestUser(const std::string& plateNumber = "");
    
    // 创建VIP用户账户（月卡或年卡）
    bool createVipUser(const std::string& username, const std::string& password, 
                      const std::string& cardType, const std::string& expiryDate);
    
    // 查找用户
    std::shared_ptr<User> findUser(const std::string& username) const;
    
    // 获取所有用户列表
    const std::vector<std::shared_ptr<User>>& getAllUsers() const;
};

#endif // USER_MANAGER_H