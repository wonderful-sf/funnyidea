
#include <opencv2/opencv.hpp>
#include <iostream>

using namespace cv;
using namespace std;

int main()
{
    VideoCapture cap(0);
    Mat img;

    while (1)
    {
        cap >> img;
        Mat grayimg ;
        cvtColor(img, grayimg,COLOR_BGR2GRAY);
        if (img.empty())
            break;
        namedWindow("img", WINDOW_NORMAL);
        imshow("img", img);
        namedWindow("grayimg", WINDOW_NORMAL);
        imshow("grayimg", grayimg);
        if (27 == waitKey(20))
            break;
    }

    return 0;
}

