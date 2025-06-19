document.addEventListener('DOMContentLoaded', function() {
    // 加载商品列表
    loadProducts();
    
    // 设置搜索功能
    setupSearch();
    
    // 设置分类筛选功能
    setupCategoryFilter();
    
    // 检查登录状态
    checkLoginStatus();
});

//
const productsData = {
    1: {
        id: 1,
        title: 'iPhone 13 Pro',
        price: 4999,
        originalPrice: 7999,
        category: '电子产品',
        condition: '9成新',
        description: `iPhone 13 Pro，256GB存储空间，石墨色。购买于2023年3月，使用时间不到一年，9成新。`,
        images: ['img/iPhone13.jpg', 'img/iPhone13.jpg', 'img/iPhone13.jpg'],
        publishTime: '2024-01-15',
        viewCount: 128,
        seller: {
            name: '张同学',
            avatar: 'img/icon.png',
            rating: 4.8,
            salesCount: 15
        }
    },
    2: {
        id: 2,
        title: 'MacBook Air M1',
        price: 6999,
        originalPrice: 8999,
        category: '电子产品',
        condition: '8成新',
        description: `MacBook Air M1芯片，13英寸，8GB内存，256GB存储。`,
        images: ['img/macbook.jpg.avif', 'img/macbook.jpg.avif', 'img/macbook.jpg.avif'],
        publishTime: '2024-01-14',
        viewCount: 95,
        seller: {
            name: '李同学',
            avatar: 'img/icon.png',
            rating: 4.9,
            salesCount: 8
        }
    },
    3: {
        id: 3,
        title: 'AirPods Pro',
        price: 1299,
        originalPrice: 1999,
        category: '电子产品',
        condition: '9成新',
        description: `AirPods Pro 第二代，主动降噪功能，音质出色。`,
        images: ['img/airpods.jpg', 'img/airpods.jpg', 'img/airpods.jpg'],
        publishTime: '2024-01-13',
        viewCount: 76,
        seller: {
            name: '王同学',
            avatar: 'img/icon.png',
            rating: 4.7,
            salesCount: 12
        }
    },
    4: {
        id: 4,
        title: 'PlayStation 5',
        price: 3999,
        originalPrice: 4299,
        category: '电子产品',
        condition: '全新',
        description: `PlayStation 5游戏主机，全新未拆封。`,
        images: ['img/ps5.jpg.avif', 'img/ps5.jpg.avif', 'img/ps5.jpg.avif'],
        publishTime: '2024-01-12',
        viewCount: 203,
        seller: {
            name: '赵同学',
            avatar: 'img/icon.png',
            rating: 5.0,
            salesCount: 3
        }
    },
    5: {
        id: 5,
        title: '华为 MateBook 14',
        price: 5299,
        originalPrice: 6299,
        category: '电子产品',
        condition: '9成新',
        description: `华为 MateBook 14 2022款，i5处理器，16GB内存，512GB固态硬盘。`,
        images: ['img/hwmc.avif', 'img/hwmc.avif', 'img/hwmc.avif'],
        publishTime: '2024-01-10',
        viewCount: 87,
        seller: {
            name: '陈同学',
            avatar: 'img/icon.png',
            rating: 4.6,
            salesCount: 7
        }
    },
    6: {
        id: 6,
        title: '自行车',
        price: 599,
        originalPrice: 899,
        category: '交通工具',
        condition: '8成新',
        description: `捷安特自行车，使用一年，车况良好，无明显磨损。`,
        images: ['img/jat.avif', 'img/jat.avif', 'img/jat.avif'],
        publishTime: '2024-01-09',
        viewCount: 65,
        seller: {
            name: '刘同学',
            avatar: 'img/icon.png',
            rating: 4.5,
            salesCount: 4
        }
    }
};

// 当前选中的分类
let currentCategory = 'all';
let currentSearchTerm = '';

// 加载商品列表
function loadProducts(searchTerm = '', category = 'all') {
    // 更新当前搜索词和分类
    currentSearchTerm = searchTerm;
    currentCategory = category;
    
    // 创建商品列表容器（如果不存在）
    let productsContainer = document.querySelector('.products-container');
    if (!productsContainer) {
        productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        document.querySelector('main').appendChild(productsContainer);
    }
    
    // 创建商品列表标题
    let productsTitle = document.querySelector('.products-title');
    if (!productsTitle) {
        productsTitle = document.createElement('h2');
        productsTitle.className = 'products-title';
        productsTitle.textContent = '商品列表';
        productsContainer.appendChild(productsTitle);
    }
    
    // 更新标题显示当前分类
    if (category !== 'all') {
        const categoryNames = {
            'electronics': '电子产品',
            'books': '教材书籍',
            'furniture': '宿舍家具',
            'clothing': '服装鞋帽',
            'sports': '运动健身',
            'transportation': '交通工具',
            'others': '其他物品'
        };
        productsTitle.textContent = categoryNames[category] || '商品列表';
    } else {
        productsTitle.textContent = '全部商品';
    }
    
    // 创建商品网格
    let productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        productsGrid = document.createElement('div');
        productsGrid.className = 'products-grid';
        productsContainer.appendChild(productsGrid);
    }
    
    // 过滤商品（根据搜索词和分类）
    let filteredProducts = Object.values(productsData);
    
    // 按分类筛选
    if (category !== 'all') {
        const categoryMapping = {
            'electronics': '电子产品',
            'books': '教材书籍',
            'furniture': '宿舍家具',
            'clothing': '服装鞋帽',
            'sports': '运动健身',
            'transportation': '交通工具',
            'others': '其他物品'
        };
        
        filteredProducts = filteredProducts.filter(product => {
            // 处理中文分类名称与英文分类值的映射
            const chineseCategoryName = categoryMapping[category];
            return product.category === chineseCategoryName || 
                  (category === 'others' && !Object.values(categoryMapping).includes(product.category));
        });
    }
    
    // 按搜索词筛选
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // 如果没有商品，显示提示信息
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <img src="img/icon.png" alt="暂无商品">
                <h3>暂无商品</h3>
                <p>没有找到符合条件的商品</p>
            </div>
        `;
        return;
    }
    
    // 生成商品列表HTML
    const productsHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}" onerror="this.src='img/icon.png'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-meta">
                    <span class="product-price">¥${product.price}</span>
                    <span class="product-original-price">¥${product.originalPrice}</span>
                </div>
                <div class="product-footer">
                    <span class="product-condition">${product.condition}</span>
                    <span class="product-views"><i class="view-icon"></i> ${product.viewCount}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    productsGrid.innerHTML = productsHTML;
}

// 设置搜索功能
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        const searchInput = searchBox.querySelector('input');
        const searchButton = searchBox.querySelector('button');
        
        // 点击搜索按钮时执行搜索
        searchButton.addEventListener('click', function() {
            loadProducts(searchInput.value.trim(), currentCategory);
        });
        
        // 按回车键时执行搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadProducts(searchInput.value.trim(), currentCategory);
            }
        });
    }
}

// 设置分类筛选功能
function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取分类值并加载对应商品
            const category = this.getAttribute('data-category');
            loadProducts(currentSearchTerm, category);
        });
    });
}

// 查看商品详情
function viewProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}