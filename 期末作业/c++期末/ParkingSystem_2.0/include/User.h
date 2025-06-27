#ifndef USER_H
#define USER_H

#include <string>

// 用户基类
class User {
protected:
    std::string username;
    std::string password;
    std::string userType;

public:
    User(const std::string& username = "", const std::string& password = "", const std::string& userType = "Guest");
    virtual ~User() = default;
    
    // 获取用户信息
    std::string getUsername() const { return username; }
    std::string getUserType() const { return userType; }
    std::string getPassword() const { return password; } // 添加获取密码的方法
    
    // 验证密码
    bool verifyPassword(const std::string& inputPassword) const;
    
    // 纯虚函数，计算停车费用（不同类型用户有不同折扣）
    virtual double calculateParkingFee(double baseFee) const = 0;
};

// 临时访客类
class GuestUser : public User {
public:
    GuestUser(const std::string& username = "guest", const std::string& password = "");
    
    // 临时访客没有折扣
    double calculateParkingFee(double baseFee) const override;
};

// 管理员类
class AdminUser : public User {
public:
    AdminUser(const std::string& username, const std::string& password);
    
    // 管理员免费停车
    double calculateParkingFee(double baseFee) const override;
};

// VIP用户基类
class VipUser : public User {
protected:
    std::string cardType;  // 月卡或年卡
    std::string expiryDate; // 到期日期

public:
    VipUser(const std::string& username, const std::string& password, 
           const std::string& cardType, const std::string& expiryDate);
    
    std::string getCardType() const { return cardType; }
    std::string getExpiryDate() const { return expiryDate; }
    
    // VIP用户有折扣
    double calculateParkingFee(double baseFee) const override;
};

// 月卡用户
class MonthlyUser : public VipUser {
public:
    MonthlyUser(const std::string& username, const std::string& password, const std::string& expiryDate);
    
    // 月卡用户有特定折扣
    double calculateParkingFee(double baseFee) const override;
};

// 年卡用户
class YearlyUser : public VipUser {
public:
    YearlyUser(const std::string& username, const std::string& password, const std::string& expiryDate);
    
    // 年卡用户有更高折扣
    double calculateParkingFee(double baseFee) const override;
};

#endif // USER_H