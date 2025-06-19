#include "../include/Menu.h"
#include <iostream>
#include <string>

int main() {
    try {
        // 创建菜单对象并运行系统
        Menu menu;
        menu.run();
        
        // 程序结束前暂停，让用户有时间查看输出
        std::cout << "\n按回车键退出程序..." << std::endl;
        std::string dummy;
        std::getline(std::cin, dummy);
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "程序发生错误: " << e.what() << std::endl;
        std::cout << "\n按回车键退出程序..." << std::endl;
        std::string dummy;
        std::getline(std::cin, dummy);
        return 1;
    }
}
