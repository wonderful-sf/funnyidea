#ifndef TIME_H
#define TIME_H
#include <string>
#include "Date.h"
class Time{
    private:
        Date date;
        int hour,minute,second;
    public:
        Time(int y=1,int m=1,int d=1,int h=1,int mi=1,int s=1):date(y,m,d),hour(h),minute(mi),second(s){};
        int getHour() const{return hour;}
        int getMinute() const{return minute;}
        int getSecond() const{return second;}
        int getTotalMinutes(const Time &t) const;
        void show() const;
};
#endif