document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 自动轮播定时器
    let autoSlideTimer; 
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 添加活动状态
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // 下一张幻灯片
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // 开始自动轮播
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 5000); // 每5秒切换
    }
    
    // 停止自动轮播
    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
    }
    
    // 重启自动轮播
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // 事件监听器
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoSlide();
        });
    }
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            restartAutoSlide();
        });
    });
    
    // 鼠标悬停时暂停自动轮播
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            restartAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            restartAutoSlide();
        }
    });
    
    // 启动自动轮播
    if (slides.length > 0) {
        startAutoSlide();
    }
    
    // 加载热门商品
    loadFeaturedProducts();
});

// 加载热门商品数据
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    // 模拟商品数据
    const featuredProducts = [
        {
            id: 1,
            title: 'iPhone 13 Pro',
            price: 4999,
            image: 'img/iPhone13.jpg',
            description: '9成新，无磕碰，配件齐全'
        },
        {
            id: 2,
            title: 'MacBook Air M1',
            price: 6999,
            image: 'img/macbook.jpg.avif',
            description: '轻薄便携，性能强劲，适合学习办公'
        },
        {
            id: 3,
            title: 'AirPods Pro',
            price: 1299,
            image: 'img/airpods.jpg',
            description: '主动降噪，音质出色，几乎全新'
        },
        {
            id: 4,
            title: 'PlayStation 5',
            price: 3999,
            image: 'img/ps5.jpg.avif',
            description: '全新未拆封，支持4K游戏体验'
        },
        {
            id: 5,
            title: 'iPhone 13 Pro',
            price: 4999,
            image: 'img/iPhone13.jpg',
            description: '9成新，无磕碰，配件齐全'
        },
        {
            id: 6,
            title: 'MacBook Air M1',
            price: 6999,
            image: 'img/macbook.jpg.avif',
            description: '轻薄便携，性能强劲，适合学习办公'
        },
    ];
    
    // 生成商品卡片HTML
    const productsHTML = featuredProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='img/icon.png'">
            <div class="product-info">
                <h3>${product.title}</h3>
                <div class="price">¥${product.price}</div>
                <div class="description">${product.description}</div>
            </div>
        </div>
    `).join('');
    
    featuredContainer.innerHTML = productsHTML;
}

// 查看商品详情
function viewProduct(productId) {
    // 跳转到商品详情页
    window.location.href = `detail.html?id=${productId}`;
}