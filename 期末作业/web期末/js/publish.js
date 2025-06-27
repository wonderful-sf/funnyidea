document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化图片上传功能
    initImageUpload();
    
    // 初始化表单验证和提交
    initFormSubmit();
    
    // 初始化分类选择的交互效果
    initCategorySelection();
});

// 初始化图片上传功能
function initImageUpload() {
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const productImages = document.getElementById('product-images');

    if (!imageUpload || !imagePreview || !productImages) return;

    // 点击上传区域触发文件选择
    imageUpload.addEventListener('click', function() {
        productImages.click();
    });

    // 监听文件选择变化
    productImages.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // 拖拽上传
    imageUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageUpload.style.borderColor = '#3498db';
        imageUpload.style.backgroundColor = '#f0f7fc';
    });

    imageUpload.addEventListener('dragleave', function() {
        imageUpload.style.borderColor = '#ddd';
        imageUpload.style.backgroundColor = '';
    });

    imageUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        imageUpload.style.borderColor = '#ddd';
        imageUpload.style.backgroundColor = '';

        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // 处理上传的文件
    function handleFiles(files) {
        // 限制最多上传5张图片
        const currentCount = imagePreview.querySelectorAll('.preview-item').length;
        const remainingSlots = 5 - currentCount;
        
        if (remainingSlots <= 0) {
            showNotification('最多只能上传5张图片', 'warning', '上传限制');
            return;
        }
        
        // 处理文件
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            // 检查是否为图片
            if (!file.type.match('image.*')) {
                showNotification('请选择图片文件', 'error', '格式错误');
                continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = 'x';
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    previewItem.remove();
                    updateImageCounter();
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreview.appendChild(previewItem);
                
                updateImageCounter();
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // 更新图片计数器
    function updateImageCounter() {
        const currentCount = imagePreview.querySelectorAll('.preview-item').length;
        const counterElement = document.createElement('div');
        counterElement.className = 'image-counter';
        counterElement.textContent = `${currentCount}/5 张图片`;
        
        // 移除旧的计数器
        const oldCounter = imagePreview.querySelector('.image-counter');
        if (oldCounter) {
            oldCounter.remove();
        }
        
        // 添加新的计数器
        if (currentCount > 0) {
            imagePreview.appendChild(counterElement);
        }
    }
}

// 初始化表单验证和提交
function initFormSubmit() {
    const publishForm = document.querySelector('.publish-form');
    if (!publishForm) return;
    
    publishForm.addEventListener('submit', function(event) {
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
        const tradeMethod = document.getElementById('trade-method').value;
        const contactName = document.getElementById('contact-name').value.trim();
        const contactPhone = document.getElementById('contact-phone').value.trim();
        
        // 表单验证
        if (!title || !category || !price || !condition || !description || !tradeMethod || !contactName || !contactPhone) {
            showNotification('请填写所有必填字段！', 'error', '验证失败');
            return;
        }
        
        if (isNaN(price) || parseFloat(price) <= 0) {
            showNotification('请输入有效的价格！', 'error', '验证失败');
            return;
        }
        
        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(contactPhone)) {
            showNotification('请输入有效的手机号码！', 'error', '验证失败');
            return;
        }
        
        // 检查是否上传了图片
        const uploadedImages = getUploadedImages();
        if (uploadedImages.length === 0) {
            showNotification('请至少上传一张商品图片！', 'error', '验证失败');
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
            tradeMethod,
            contactName,
            contactPhone,
            images: uploadedImages,
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
        publishForm.reset();
        clearUploadedImages();
        
        // 跳转到商品详情页
        setTimeout(() => {
            window.location.href = `detail.html?id=${product.id}`;
        }, 2000);
    });
}

// 获取上传的图片
function getUploadedImages() {
    const imagePreview = document.getElementById('image-preview');
    if (!imagePreview) return [];
    
    const images = [];
    const previewItems = imagePreview.querySelectorAll('.preview-item img');
    
    previewItems.forEach(img => {
        images.push(img.src);
    });
    
    return images.length > 0 ? images : ['img/icon.png'];
}

// 清空上传的图片
function clearUploadedImages() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
}

// 初始化分类选择的交互效果
function initCategorySelection() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;
    
    // 添加分类选择变化事件
    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        if (selectedCategory) {
            // 可以根据选择的分类动态调整表单其他部分
            updateFormBasedOnCategory(selectedCategory);
        }
    });
}

// 根据选择的分类更新表单
function updateFormBasedOnCategory(category) {
    // 根据不同分类可以动态调整表单字段或提示信息
    const categoryTips = {
        'electronics': '建议详细描述电子产品的型号、使用时长、电池健康度等信息。',
        'books': '建议说明书籍的版本、出版年份、是否有笔记等情况。',
        'furniture': '建议描述家具的尺寸、材质、使用年限等信息。',
        'clothing': '建议说明衣物的尺码、面料、穿着次数等情况。',
        'sports': '建议描述运动器材的品牌、使用频率、磨损程度等信息。',
        'others': '请尽可能详细描述商品的各方面信息。'
    };
    
    // 更新提示信息
    const descriptionField = document.getElementById('description');
    if (descriptionField && categoryTips[category]) {
        descriptionField.placeholder = categoryTips[category];
    }
}

// 显示通知消息
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
        'error': '#F44336',
        'warning': '#FF9800',
        'info': '#2196F3'
    };
    return colors[type] || colors.info;
}