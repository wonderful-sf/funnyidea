document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 加载用户信息
    loadUserInfo();
    
    // 初始化侧边栏导航
    initSidebarNavigation();
    
    // 初始化商品标签页
    initProductTabs();
    
    // 加载用户商品
    loadUserProducts();
    
    // 加载收藏列表
    loadFavorites();
    
    // 初始化表单事件
    initFormEvents();
});

// 加载用户信息
function loadUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    // 更新侧边栏用户信息
    document.getElementById('userName').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email;
    
    // 更新个人资料表单
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-email').value = user.email;
    document.getElementById('profile-phone').value = user.phone || '';
    document.getElementById('profile-studentId').value = user.studentId;
}

// 初始化侧边栏导航
function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // 根据选中的部分加载相应数据
            switch(targetSection) {
                case 'my-products':
                    loadUserProducts();
                    break;
                case 'favorites':
                    loadFavorites();
                    break;
            }
        });
    });
}

// 初始化商品标签页
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            
            // 更新标签页状态
            tabBtns.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // 重新加载商品列表
            loadUserProducts(status);
        });
    });
}

// 加载用户商品
function loadUserProducts(status = 'all') {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const userProducts = JSON.parse(localStorage.getItem(`products_${user.username}`)) || [];
    
    // 根据状态过滤商品
    let filteredProducts = userProducts;
    if (status === 'selling') {
        filteredProducts = userProducts.filter(product => product.status === 'selling');
    } else if (status === 'sold') {
        filteredProducts = userProducts.filter(product => product.status === 'sold');
    }
    
    const productsList = document.getElementById('userProductsList');
    
    if (filteredProducts.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <img src="img/icon.png" alt="暂无商品">
                <h3>暂无商品</h3>
                <p>您还没有发布任何商品</p>
                <a href="publish.html" class="btn">立即发布</a>
            </div>
        `;
        return;
    }
    
    const productsHTML = filteredProducts.map(product => `
        <div class="product-item">
            <img src="${product.images[0] || 'img/icon.png'}" alt="${product.title}" onerror="this.src='img/icon.png'">
            <div class="product-item-info">
                <h4>${product.title}</h4>
                <div class="product-price">¥${product.price}</div>
                <div class="product-status ${product.status === 'selling' ? 'status-selling' : 'status-sold'}">
                    ${product.status === 'selling' ? '在售' : '已售'}
                </div>
                <div class="product-actions">
                    <button class="btn-small btn-view" onclick="viewProduct('${product.id}')">查看</button>
                    <button class="btn-small btn-edit" onclick="editProduct('${product.id}')">编辑</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct('${product.id}')">删除</button>
                </div>
            </div>
        </div>
    `).join('');
    
    productsList.innerHTML = productsHTML;
}

// 加载收藏列表
function loadFavorites() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.username}`)) || [];
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <img src="img/icon.png" alt="暂无收藏">
                <h3>暂无收藏</h3>
                <p>您还没有收藏任何商品</p>
                <a href="item.html" class="btn">去逛逛</a>
            </div>
        `;
        return;
    }
    
    const mockProducts = {
        '1': { id: '1', title: 'iPhone 13 Pro', price: 4999, image: 'img/iPhone13.jpg' },
        '2': { id: '2', title: 'MacBook Air M1', price: 6999, image: 'img/macbook.jpg.avif' },
        '3': { id: '3', title: 'AirPods Pro', price: 1299, image: 'img/airpods.jpg' },
        '4': { id: '4', title: 'PlayStation 5', price: 3999, image: 'img/ps5.jpg.avif' }
    };
    
    const favoritesHTML = favorites.map(productId => {
        const product = mockProducts[productId];
        if (!product) return '';
        
        return `
            <div class="favorite-item">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='img/icon.png'">
                <div class="favorite-item-info">
                    <h4>${product.title}</h4>
                    <div class="product-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-small btn-view" onclick="viewProduct('${product.id}')">查看</button>
                        <button class="btn-small btn-delete" onclick="removeFavorite('${product.id}')">移除</button>
                    </div>
                </div>
            </div>
        `;
    }).filter(html => html !== '').join('');
    
    favoritesList.innerHTML = favoritesHTML;
}

// 初始化表单事件
function initFormEvents() {
    // 个人资料表单
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // 修改密码表单
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// 处理个人资料更新
function handleProfileUpdate(event) {
    event.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const formData = new FormData(event.target);
    
    // 更新用户信息
    user.email = formData.get('email');
    user.phone = formData.get('phone');
    
    // 保存到localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // 更新用户列表中的信息
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    showNotification('个人资料更新成功！', 'success', '更新成功');
}

// 处理密码修改
function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const formData = new FormData(event.target);
    
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');
    
    // 验证当前密码
    if (currentPassword !== user.password) {
        showNotification('当前密码错误！', 'error', '验证失败');
        return;
    }
    
    // 验证新密码
    if (newPassword !== confirmNewPassword) {
        showNotification('两次输入的新密码不一致！', 'error', '验证失败');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('新密码长度不能少于6位！', 'error', '验证失败');
        return;
    }
    
    // 更新密码
    user.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // 更新用户列表中的密码
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // 清空表单
    event.target.reset();
    
    showNotification('密码修改成功！', 'success', '修改成功');
}

// 查看商品
function viewProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// 编辑商品
function editProduct(productId) {
    window.location.href = `publish.html?edit=${productId}`;
}

// 删除商品
function deleteProduct(productId) {
    if (!confirm('确定要删除这个商品吗？删除后无法恢复。')) {
        return;
    }
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    let userProducts = JSON.parse(localStorage.getItem(`products_${user.username}`)) || [];
    
    // 删除商品
    userProducts = userProducts.filter(product => product.id !== productId);
    localStorage.setItem(`products_${user.username}`, JSON.stringify(userProducts));
    
    // 重新加载商品列表
    loadUserProducts();
    
    showNotification('商品删除成功！', 'success', '删除成功');
}

// 移除收藏
function removeFavorite(productId) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    let favorites = JSON.parse(localStorage.getItem(`favorites_${user.username}`)) || [];
    
    // 移除收藏
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    
    // 重新加载收藏列表
    loadFavorites();
    
    showNotification('已移除收藏！', 'success', '移除成功');
}

// 通知函数（如果script.js中没有定义）
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info', title = '提示') {
        alert(`${title}: ${message}`);
    }
}