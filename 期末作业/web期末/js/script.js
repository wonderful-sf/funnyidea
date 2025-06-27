// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 获取注册表单
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 获取登录表单
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 获取发布商品表单
    const publishForm = document.querySelector('.publish-form');
    if (publishForm) {
        publishForm.addEventListener('submit', handlePublish);
        setupImageUpload();
    }
    
    // 为需要登录的链接添加检查
    addLoginCheckToLinks();
});

// 处理注册
function handleRegister(event) {
    event.preventDefault();

    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone').value.trim();

    // 表单验证
    if (!username || !studentId || !email || !password || !confirmPassword || !phone) {
        showNotification('请填写所有必填字段！', 'error', '验证失败');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致！', 'error', '验证失败');
        return;
    }

    // 验证密码强度
    if (password.length < 6) {
        showNotification('密码长度不能少于6位！', 'error', '验证失败');
        return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('请输入有效的邮箱地址！', 'error', '验证失败');
        return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('请输入有效的手机号码！', 'error', '验证失败');
        return;
    }

    // 验证学号格式（假设为数字）
    const studentIdRegex = /^\d{8,12}$/;
    if (!studentIdRegex.test(studentId)) {
        showNotification('请输入有效的学号（8-12位数字）！', 'error', '验证失败');
        return;
    }

    // 获取已存在的用户数据
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        showNotification('用户名已存在！', 'error', '验证失败');
        return;
    }

    // 检查学号是否已存在
    if (users.some(user => user.studentId === studentId)) {
        showNotification('该学号已注册！', 'error', '验证失败');
        return;
    }

    // 检查邮箱是否已存在
    if (users.some(user => user.email === email)) {
        showNotification('该邮箱已注册！', 'error', '验证失败');
        return;
    }

    // 创建新用户对象
    const newUser = {
        id: Date.now().toString(), // 生成唯一ID
        username,
        studentId,
        email,
        password,
        phone,
        registerTime: new Date().toISOString(),
        avatar: 'img/icon.png'
    };

    // 将新用户添加到数组中
    users.push(newUser);

    // 保存到localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // 显示成功通知并倒计时跳转
    showNotification('注册成功！即将跳转到登录页面...', 'success', '注册成功');
    countdownRedirect('login.html', 3);
}

// 处理登录
function handleLogin(event) {
    event.preventDefault();

    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // 表单验证
    if (!username || !password) {
        showNotification('请填写用户名和密码！', 'error', '验证失败');
        return;
    }

    // 获取用户数据
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 查找用户（支持用户名、学号、邮箱登录）
    const user = users.find(u => 
        (u.username === username || u.studentId === username || u.email === username) && 
        u.password === password
    );

    if (user) {
        // 保存登录状态
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 更新最后登录时间
        user.lastLoginTime = new Date().toISOString();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // 显示成功通知并跳转
        showNotification('登录成功！即将跳转到首页...', 'success', '登录成功');
        countdownRedirect('index.html', 2);
    } else {
        showNotification('用户名或密码错误！', 'error', '登录失败');
    }
}

// 检查登录状态
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const userActions = document.querySelector('.user-actions');
    
    if (currentUser && userActions) {
        const user = JSON.parse(currentUser);
        userActions.innerHTML = `
            <a href="personal.html"><span>欢迎，${user.username}</span></a>
            <a href="#" class="btn" onclick="logout()">退出</a>
        `;
    }
    
    // 添加页面链接的登录检查
    addLoginCheckToLinks();
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('currentUser');
        showNotification('已退出登录', 'info', '退出成功');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// 为个人中心和发布商品链接添加登录检查
function addLoginCheckToLinks() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // 检查是否是需要登录的页面
        if (href === 'personal.html' || href === 'publish.html') {
            // 移除原有的点击事件
            link.removeEventListener('click', handleProtectedLink);
            // 添加新的点击事件
            link.addEventListener('click', handleProtectedLink);
        }
    });
}

// 处理受保护页面的链接点击
function handleProtectedLink(event) {
    event.preventDefault();
    
    const href = this.getAttribute('href');
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // 已登录，正常跳转
        window.location.href = href;
    } else {
        // 未登录，提示并跳转到登录页面
        showNotification('请先登录后再访问此页面', 'warning', '需要登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// 处理发布商品
function handlePublish(event) {
    event.preventDefault();
    
    // 检查登录状态
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showNotification('请先登录后再发布商品', 'warning', '需要登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // 获取表单数据
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const condition = document.getElementById('condition').value;
    const description = document.getElementById('description').value.trim();
    const contact = document.getElementById('contact').value.trim();
    
    // 表单验证
    if (!title || !category || !price || !condition || !description || !contact) {
        showNotification('请填写所有必填字段！', 'error', '验证失败');
        return;
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
        showNotification('请输入有效的价格！', 'error', '验证失败');
        return;
    }
    
    // 创建商品对象
    const user = JSON.parse(currentUser);
    const product = {
        id: Date.now().toString(),
        title,
        category,
        price: parseFloat(price),
        condition,
        description,
        contact,
        images: getUploadedImages(), // 获取上传的图片
        publishTime: new Date().toISOString(),
        seller: user.username,
        sellerId: user.id,
        status: 'selling',
        viewCount: 0
    };
    
    // 保存商品到用户的商品列表
    const userProducts = JSON.parse(localStorage.getItem(`products_${user.username}`) || '[]');
    userProducts.push(product);
    localStorage.setItem(`products_${user.username}`, JSON.stringify(userProducts));
    
    // 保存到全局商品列表
    const allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]');
    allProducts.push(product);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    
    showNotification('商品发布成功！', 'success', '发布成功');
    
    // 清空表单
    event.target.reset();
    clearUploadedImages();
    
    // 跳转到商品详情页
    setTimeout(() => {
        window.location.href = `detail.html?id=${product.id}`;
    }, 2000);
}

// 设置图片上传
function setupImageUpload() {
    const imageInput = document.getElementById('images');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(event) {
            const files = event.target.files;
            imagePreview.innerHTML = '';
            
            for (let i = 0; i < Math.min(files.length, 5); i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100px';
                        img.style.height = '100px';
                        img.style.objectFit = 'cover';
                        img.style.margin = '5px';
                        img.style.border = '1px solid #ddd';
                        img.style.borderRadius = '5px';
                        imagePreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
}

// 获取上传的图片（模拟）
function getUploadedImages() {
    return ['img/icon.png'];
}

// 清空上传的图片
function clearUploadedImages() {
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
    const imageInput = document.getElementById('images');
    if (imageInput) {
        imageInput.value = '';
    }
}

// 显示通知
function showNotification(message, type = 'info', title = '提示') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196F3'
    };
    return colors[type] || colors.info;
}

// 倒计时跳转
function countdownRedirect(url, seconds) {
    let countdown = seconds;
    const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(timer);
            window.location.href = url;
        }
    }, 1000);
}

// 添加CSS动画
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            opacity: 0.7;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .notification-message {
            font-size: 14px;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
}