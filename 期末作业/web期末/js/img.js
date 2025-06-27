document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');

    // 点击上传区域触发文件选择
    imageUpload.addEventListener('click', function () {
        document.getElementById('product-images').click();
    });

    // 监听文件选择变化
    document.getElementById('product-images').addEventListener('change', function () {
        handleFiles(this.files);
    });
    // 拖拽上传
    imageUpload.addEventListener('dragover', function (e) {
        e.preventDefault();
        imageUpload.style.borderColor = '#3498db';
        imageUpload.style.backgroundColor = '#f0f7fc';
    });

    imageUpload.addEventListener('dragleave', function () {
        imageUpload.style.borderColor = '#ddd';
        imageUpload.style.backgroundColor = '';
    });

    imageUpload.addEventListener('drop', function (e) {
        e.preventDefault();
        imageUpload.style.borderColor = '#ddd';
        imageUpload.style.backgroundColor = '';

        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    function handleFiles(files) {
        // 限制最多上传5张图片
        const currentCount = imagePreview.querySelectorAll('.preview-item').length;
        const remainingSlots = 5 - currentCount;
        
        if (remainingSlots <= 0) {
            alert('最多只能上传5张图片');
            return;
        }
        
        // 处理文件
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            // 检查是否为图片
            if (!file.type.match('image.*')) {
                alert('请选择图片文件');
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
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreview.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        }
    }

});