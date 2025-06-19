#include "../include/User.h"

// User基类实现
User::User(const std::string& username, const std::string& password, const std::string& userType)
    : username(username), password(password), userType(userType) {}

bool User::verifyPassword(const std::string& inputPassword) const {
    return password == inputPassword;
}

// GuestUser实现
GuestUser::GuestUser(const std::string& username, const std::string& password)
    : User(username, password, "Guest") {}

double GuestUser::calculateParkingFee(double baseFee) const {
    // 临时访客没有折扣
    return baseFee;
}

// AdminUser实现
AdminUser::AdminUser(const std::string& username, const std::string& password)
    : User(username, password, "Admin") {}

double AdminUser::calculateParkingFee(double baseFee) const {
    // 管理员免费停车
    return 0.0;
}

// VipUser实现
VipUser::VipUser(const std::string& username, const std::string& password, 
                 const std::string& cardType, const std::string& expiryDate)
    : User(username, password, "VIP"), cardType(cardType), expiryDate(expiryDate) {}

double VipUser::calculateParkingFee(double baseFee) const {
    // 基本VIP折扣
    return baseFee * 0.8; // 8折
}

// MonthlyUser实现
MonthlyUser::MonthlyUser(const std::string& username, const std::string& password, const std::string& expiryDate)
    : VipUser(username, password, "Monthly", expiryDate) {}

double MonthlyUser::calculateParkingFee(double baseFee) const {
    // 月卡用户折扣
    return baseFee * 0.7; // 7折
}

// YearlyUser实现
YearlyUser::YearlyUser(const std::string& username, const std::string& password, const std::string& expiryDate)
    : VipUser(username, password, "Yearly", expiryDate) {}

double YearlyUser::calculateParkingFee(double baseFee) const {
    // 年卡用户折扣
    return baseFee * 0.5; // 5折
}