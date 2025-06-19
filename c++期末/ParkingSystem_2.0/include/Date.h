#ifndef DATE_H
#define DATE_H
class Date
{
private:
    int year, month, day;
    int totalDays;

public:
    Date(int y, int m, int d);
    int getYear() const { return year; };
    int getMonth() const { return month; };
    int getDay() const { return day; };
    int getMaxDay() const;
    bool isLeapYear() const
    {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    };
    void show() const;
    int distance(const Date &d) const
    {
        return totalDays - d.totalDays;
    };
};
#endif
