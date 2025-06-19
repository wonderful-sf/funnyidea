document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // 加载商品详情
    loadProductDetail(productId);
    
    // 加载相关商品
    loadRelatedProducts();
    
    // 检查登录状态
    checkLoginStatus();
});

// 商品数据
const productsData = {
    1: {
        id: 1,
        title: 'iPhone 13 Pro',
        price: 4999,
        originalPrice: 7999,
        category: '电子产品',
        condition: '9成新',
        description: `iPhone 13 Pro，256GB存储空间，石墨色。购买于2023年3月，使用时间不到一年，9成新。
        
包装盒、充电线、说明书等配件齐全，无磕碰无划痕，电池健康度95%以上。
        
因为换了新手机所以出售，价格可小刀，诚心要的联系。
        
支持校内面交，可当面验货，安全可靠。`,
        images: ['img/iPhone13.jpg', 'img/iPhone13.jpg', 'img/iPhone13.jpg'],
        publishTime: '2024-01-15',
        viewCount: 128,
        seller: {
            name: '张同学',
            avatar: 'img/icon.png',
            rating: 4.8,
            salesCount: 15,
            phone: '138****5678',
            wechat: 'zhang_student',
            qq: '123456789'
        }
    },
    2: {
        id: 2,
        title: 'MacBook Air M1',
        price: 6999,
        originalPrice: 8999,
        category: '电子产品',
        condition: '8成新',
        description: `MacBook Air M1芯片，13英寸，8GB内存，256GB存储。
        
轻薄便携，性能强劲，适合学习办公。外观有轻微使用痕迹，但不影响使用。
        
充电器、包装盒齐全，支持面交验货。`,
        images: ['img/macbook.jpg.avif', 'img/macbook.jpg.avif', 'img/macbook.jpg.avif'],
        publishTime: '2024-01-14',
        viewCount: 95,
        seller: {
            name: '李同学',
            avatar: 'img/icon.png',
            rating: 4.9,
            salesCount: 8,
            phone: '139****1234',
            wechat: 'li_student',
            qq: '987654321'
        }
    },
    3: {
        id: 3,
        title: 'AirPods Pro',
        price: 1299,
        originalPrice: 1999,
        category: '电子产品',
        condition: '9成新',
        description: `AirPods Pro 第二代，主动降噪功能，音质出色。
        
购买不到半年，几乎全新，包装盒、充电线等配件齐全。
        
因为收到了新款所以出售，价格实惠。`,
        images: ['img/airpods.jpg', 'img/airpods.jpg', 'img/airpods.jpg'],
        publishTime: '2024-01-13',
        viewCount: 76,
        seller: {
            name: '王同学',
            avatar: 'img/icon.png',
            rating: 4.7,
            salesCount: 12,
            phone: '137****9876',
            wechat: 'wang_student',
            qq: '456789123'
        }
    },
    4: {
        id: 4,
        title: 'PlayStation 5',
        price: 3999,
        originalPrice: 4299,
        category: '电子产品',
        condition: '全新',
        description: `PlayStation 5游戏主机，全新未拆封。
        
支持4K游戏体验，性能强劲。因为买重了所以出售。
        
包装完整，支持当面验货，价格可议。`,
        images: ['img/ps5.jpg.avif', 'img/ps5.jpg.avif', 'img/ps5.jpg.avif'],
        publishTime: '2024-01-12',
        viewCount: 203,
        seller: {
            name: '赵同学',
            avatar: 'img/icon.png',
            rating: 5.0,
            salesCount: 3,
            phone: '135****5432',
            wechat: 'zhao_student',
            qq: '789123456'
        }
    },   
     5: {
        id: 5,
        title: 'iPhone 13 Pro',
        price: 4999,
        originalPrice: 7999,
        category: '电子产品',
        condition: '9成新',
        description: `iPhone 13 Pro，256GB存储空间，石墨色。购买于2023年3月，使用时间不到一年，9成新。
        
包装盒、充电线、说明书等配件齐全，无磕碰无划痕，电池健康度95%以上。
        
因为换了新手机所以出售，价格可小刀，诚心要的联系。
        
支持校内面交，可当面验货，安全可靠。`,
        images: ['img/iPhone13.jpg', 'img/iPhone13.jpg', 'img/iPhone13.jpg'],
        publishTime: '2024-01-15',
        viewCount: 128,
        seller: {
            name: '张同学',
            avatar: 'img/icon.png',
            rating: 4.8,
            salesCount: 15,
            phone: '138****5678',
            wechat: 'zhang_student',
            qq: '123456789'
        }
    },
    6: {
        id: 6,
        title: 'MacBook Air M1',
        price: 6999,
        originalPrice: 8999,
        category: '电子产品',
        condition: '8成新',
        description: `MacBook Air M1芯片，13英寸，8GB内存，256GB存储。
        
轻薄便携，性能强劲，适合学习办公。外观有轻微使用痕迹，但不影响使用。
        
充电器、包装盒齐全，支持面交验货。`,
        images: ['img/macbook.jpg.avif', 'img/macbook.jpg.avif', 'img/macbook.jpg.avif'],
        publishTime: '2024-01-14',
        viewCount: 95,
        seller: {
            name: '李同学',
            avatar: 'img/icon.png',
            rating: 4.9,
            salesCount: 8,
            phone: '139****1234',
            wechat: 'li_student',
            qq: '987654321'
        }
    },
};

// 加载商品详情
function loadProductDetail(productId) {
    const product = productsData[productId];
    
    if (!product) {
        // 如果没有找到商品，显示默认信息或跳转到商品列表
        document.getElementById('detailProductTitle').textContent = '商品未找到';
        return;
    }
    
    // 更新页面标题
    document.title = `${product.title} - 闲狮`;
    
    // 更新面包屑导航
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productTitle').textContent = product.title;
    
    // 更新商品信息
    document.getElementById('detailProductTitle').textContent = product.title;
    document.getElementById('detailProductPrice').textContent = `¥${product.price}`;
    document.getElementById('productCondition').textContent = product.condition;
    document.getElementById('detailProductCategory').textContent = product.category;
    document.getElementById('publishTime').textContent = product.publishTime;
    document.getElementById('viewCount').textContent = product.viewCount;
    
    // 更新商品描述
    const descriptionElement = document.getElementById('productDescription');
    const descriptionParts = product.description.split('\n\n');
    descriptionElement.innerHTML = descriptionParts.map(part => `<p>${part.trim()}</p>`).join('');
    
    // 更新商品图片
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
    
    // 更新缩略图
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (product.images[index]) {
            thumb.src = product.images[index];
            thumb.alt = `${product.title} 图片${index + 1}`;
        }
    });
    
    // 更新卖家信息
    document.getElementById('sellerName').textContent = product.seller.name;
    document.getElementById('sellerAvatar').src = product.seller.avatar;
    document.querySelector('.rating').textContent = `⭐⭐⭐⭐⭐ ${product.seller.rating}分`;
    document.querySelector('.sales-count').textContent = `已售出 ${product.seller.salesCount} 件商品`;
    
    // 更新联系方式
    document.getElementById('sellerPhone').textContent = product.seller.phone;
    document.getElementById('sellerWechat').textContent = product.seller.wechat;
    document.getElementById('sellerQQ').textContent = product.seller.qq;
    
    // 增加浏览次数
    product.viewCount++;
    document.getElementById('viewCount').textContent = product.viewCount;
}

// 切换主图片
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = thumbnail.src;
    
    // 更新缩略图激活状态
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// 联系卖家
function contactSeller() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showNotification('请先登录后再联系卖家', 'info', '需要登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
}

// 关闭联系弹窗
function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
}

// 复制到剪贴板
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板', 'success', '复制成功');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('已复制到剪贴板', 'success', '复制成功');
    });
}

// 添加到收藏
function addToFavorites() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showNotification('请先登录后再收藏商品', 'info', '需要登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // 获取用户收藏列表
    const user = JSON.parse(currentUser);
    let favorites = JSON.parse(localStorage.getItem(`favorites_${user.username}`)) || [];
    
    if (favorites.includes(productId)) {
        showNotification('该商品已在收藏列表中', 'info', '提示');
        return;
    }
    
    // 添加到收藏
    favorites.push(productId);
    localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    
    showNotification('收藏成功！', 'success', '收藏成功');
}

// 举报商品
function reportProduct() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showNotification('请先登录后再举报', 'info', '需要登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    if (confirm('确定要举报这个商品吗？我们会尽快处理您的举报。')) {
        showNotification('举报已提交，我们会尽快处理', 'success', '举报成功');
    }
}

// 查看卖家主页
function viewSellerProfile() {
    showNotification('卖家主页功能开发中...', 'info', '提示');
}

// 加载相关商品
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;
    
    // 获取当前商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const currentProductId = urlParams.get('id');
    
    // 获取其他商品作为相关商品
    const relatedProducts = Object.values(productsData)
        .filter(product => product.id.toString() !== currentProductId)
        .slice(0, 4);
    
    const relatedHTML = relatedProducts.map(product => `
        <div class="related-item" onclick="viewProduct(${product.id})">
            <img src="${product.images[0]}" alt="${product.title}" onerror="this.src='img/icon.png'">
            <div class="related-info">
                <h4>${product.title}</h4>
                <div class="related-price">¥${product.price}</div>
            </div>
        </div>
    `).join('');
    
    relatedContainer.innerHTML = relatedHTML;
}

// 查看商品详情
function viewProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeContactModal();
    }
}


if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info', title = '提示') {
        alert(`${title}: ${message}`);
    }
}