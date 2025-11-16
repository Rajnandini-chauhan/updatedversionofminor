document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const captureBtn = document.getElementById('captureBtn');
    const modelSelect = document.getElementById('modelSelect');
    const objectCount = document.getElementById('objectCount');
    const processingTime = document.getElementById('processingTime');
    const noResults = document.getElementById('noResults');
    const detectionsList = document.getElementById('detectionsList');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    let isCameraActive = false;
    let detectionInterval = null;

    // Show toast notification
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        
        // Change color based on type
        if (type === 'error') {
            toast.style.background = '#ef4444';
        } else if (type === 'warning') {
            toast.style.background = '#f59e0b';
        } else {
            toast.style.background = '#10b981';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Simulate object detection
    function simulateDetection() {
        if (!isCameraActive) return;

        // Simulate processing time
        const processTime = Math.floor(Math.random() * 100) + 50;
        processingTime.textContent = `${processTime}ms`;

        // Simulate random detections
        const objects = ['person', 'car', 'bicycle', 'truck', 'dog', 'cat'];
        const numObjects = Math.floor(Math.random() * 4) + 1;
        
        objectCount.textContent = numObjects;
        
        // Clear previous detections
        detectionsList.innerHTML = '';
        
        // Show detections list
        noResults.style.display = 'none';
        detectionsList.style.display = 'block';

        // Add new detections
        for (let i = 0; i < numObjects; i++) {
            const object = objects[Math.floor(Math.random() * objects.length)];
            const confidence = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.50 to 1.00
            
            const detectionItem = document.createElement('div');
            detectionItem.className = 'detection-item';
            detectionItem.innerHTML = `
                <div class="detection-info">
                    <span class="detection-type">${object}</span>
                    <span class="detection-confidence">Confidence: ${confidence}</span>
                </div>
                <small>Just now</small>
            `;
            
            detectionsList.appendChild(detectionItem);
        }
    }

    // Start camera
    startBtn.addEventListener('click', function() {
        isCameraActive = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        captureBtn.disabled = false;
        
        showToast('Camera started successfully');
        
        // Start simulated detection
        detectionInterval = setInterval(simulateDetection, 2000);
        
        // First detection after 1 second
        setTimeout(simulateDetection, 1000);
    });

    // Stop camera
    stopBtn.addEventListener('click', function() {
        isCameraActive = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        captureBtn.disabled = true;
        
        showToast('Camera stopped');
        
        // Clear detection interval
        if (detectionInterval) {
            clearInterval(detectionInterval);
            detectionInterval = null;
        }
        
        // Reset displays
        objectCount.textContent = '0';
        processingTime.textContent = '0ms';
        noResults.style.display = 'flex';
        detectionsList.style.display = 'none';
    });

    // Capture image
    captureBtn.addEventListener('click', function() {
        if (!isCameraActive) {
            showToast('Please start the camera first', 'warning');
            return;
        }
        
        showToast('Image captured successfully');
        
        // Simulate saving the capture
        setTimeout(() => {
            showToast('Capture saved to gallery');
        }, 1000);
    });

    // Model selection
    modelSelect.addEventListener('change', function() {
        showToast(`Model changed to: ${this.options[this.selectedIndex].text}`);
    });

    // Initialize button states
    stopBtn.disabled = true;
    captureBtn.disabled = true;
});
