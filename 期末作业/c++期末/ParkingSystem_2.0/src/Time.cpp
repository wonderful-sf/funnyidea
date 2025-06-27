#include "../include/Time.h"
#include <iostream>

void Time::show() const {
    auto pad2 = [](int num) {
        std::string s = std::to_string(num);
        return s.size() < 2 ? ("0" + s) : s;
    };
    std::cout << date.getYear() << "-"
              << pad2(date.getMonth()) << "-"
              << pad2(date.getDay()) << " "
              << pad2(getHour()) << ":"
              << pad2(getMinute()) << ":"
              << pad2(getSecond()) << std::endl;
}

int Time::getTotalMinutes(const Time &eTime) const {
    // 计算日期差异的分钟数
    int daysDiff = date.distance(eTime.date);
    int minutesFromDays = daysDiff * 24 * 60;
    
    // 计算时间差异的分钟数
    int thisTimeMinutes = hour * 60 + minute;
    int otherTimeMinutes = eTime.hour * 60 + eTime.minute;
    int minutesFromTime = otherTimeMinutes - thisTimeMinutes;
    
    // 考虑秒数的影响
    if (second <= eTime.second) {
        minutesFromTime++;
    }
    
    return minutesFromDays + minutesFromTime;
}
