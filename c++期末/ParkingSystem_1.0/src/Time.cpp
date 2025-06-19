#include "../include/Time.h"
#include <iostream>

void Time::show() const{
    std::cout<<date.getYear()<<"-"<<date.getMonth()<<"-"<<date.getDay()<<" "
    <<getHour()<<":"<<getMinute()<<":"<<getSecond()<<std::endl;
}
int Time::getTotalMinutes(const Time &eTime) const{
    int gap=date.distance(eTime.date);
    gap*=24*60;
    gap+=eTime.hour*60+eTime.minute;
    gap-=hour*60+minute;
    if(second<=eTime.second){
        gap++;
    }
    return gap;
}
