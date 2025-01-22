document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('target');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const timeSelect = document.getElementById('timeSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const speedInput = document.getElementById('speedInput');
    const autoSaveHighScore = document.getElementById('autoSaveHighScore');
    const soundEffects = document.getElementById('soundEffects');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close-button');
    const body = document.body;
    const hitSound = document.getElementById('hitSound');

    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let time = parseInt(timeSelect.value);
    let gameInterval;
    let targetInterval;

    // 初始化标靶位置
    placeTarget();

    // 更新最高分显示
    highScoreDisplay.textContent = `最高分: ${highScore}`;

    // 显示设置弹窗
    settingsModal.style.display = 'block';

    // 关闭按钮点击事件
    closeButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // 开始按钮点击事件
    startButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        startGame();
    });

    // 鼠标移动事件
    body.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // 计算晃动效果
        const dx = (mouseX - window.innerWidth / 2) / 100;
        const dy = (mouseY - window.innerHeight / 2) / 100;

        body.style.backgroundPositionX = `${dx}px`;
        body.style.backgroundPositionY = `${dy}px`;
    });

    // 鼠标点击事件
    body.addEventListener('click', (e) => {
        const targetRect = target.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (mouseX >= targetRect.left && mouseX <= targetRect.right && mouseY >= targetRect.top && mouseY <= targetRect.bottom) {
            let points = 0;

            // 根据标靶大小调整得分
            switch (sizeSelect.value) {
                case '50':
                    points = 1;
                    break;
                case '30':
                    points = 2;
                    break;
                case '20':
                    points = 3;
                    break;
            }

            score += points;
            scoreDisplay.textContent = `分数: ${score}`;
            target.style.display = 'none'; // 立即隐藏标靶

            // 播放成功音效
            if (soundEffects.checked) {
                hitSound.play();
            }

            // 显示正反馈动画
            target.classList.add('hit');
            setTimeout(() => {
                target.classList.remove('hit');
            }, 200);
        }
    });

    // 游戏计时器
    function startGame() {
        time = parseInt(timeSelect.value);
        score = 0;
        scoreDisplay.textContent = `分数: ${score}`;
        timerDisplay.textContent = `时间: ${time}秒`;

        gameInterval = setInterval(() => {
            time--;
            timerDisplay.textContent = `时间: ${time}秒`;

            if (time <= 0) {
                clearInterval(gameInterval);
                clearInterval(targetInterval);

                // 更新最高分
                if (score > highScore) {
                    highScore = score;
                    highScoreDisplay.textContent = `最高分: ${highScore}`;
                    if (autoSaveHighScore.checked) {
                        localStorage.setItem('highScore', highScore);
                    }
                }

                alert(`游戏结束！你的分数是：${score}`);
                settingsModal.style.display = 'block';
            }
        }, 1000);

        // 根据标靶大小设定调整标靶大小
        const size = parseInt(sizeSelect.value);
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;

        // 根据输入框的值调整标靶的移动速度
        const speed = parseInt(speedInput.value);
        moveTarget(speed);
    }

    // 随机放置标靶
    function placeTarget() {
        const x = Math.random() * (window.innerWidth - target.offsetWidth);
        const y = Math.random() * (window.innerHeight - target.offsetHeight);

        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        target.style.display = 'block'; // 显示标靶
    }

    // 移动标靶
    function moveTarget(interval) {
        clearInterval(targetInterval);
        targetInterval = setInterval(() => {
            placeTarget();
        }, interval);
    }

    // 加载设置
    function loadSettings() {
        const savedTime = localStorage.getItem('time');
        const savedSize = localStorage.getItem('size');
        const savedSpeed = localStorage.getItem('speed');
        const savedAutoSave = localStorage.getItem('autoSaveHighScore');
        const savedSoundEffects = localStorage.getItem('soundEffects');

        if (savedTime) {
            timeSelect.value = savedTime;
        }

        if (savedSize) {
            sizeSelect.value = savedSize;
        }

        if (savedSpeed) {
            speedInput.value = savedSpeed;
        }

        if (savedAutoSave) {
            autoSaveHighScore.checked = savedAutoSave === 'true';
        }

        if (savedSoundEffects) {
            soundEffects.checked = savedSoundEffects === 'true';
        }
    }

    // 保存设置
    function saveSettings() {
        localStorage.setItem('time', timeSelect.value);
        localStorage.setItem('size', sizeSelect.value);
        localStorage.setItem('speed', speedInput.value);
        localStorage.setItem('autoSaveHighScore', autoSaveHighScore.checked);
        localStorage.setItem('soundEffects', soundEffects.checked);
    }

    // 监听设置变化
    timeSelect.addEventListener('change', saveSettings);
    sizeSelect.addEventListener('change', saveSettings);
    speedInput.addEventListener('input', saveSettings);
    autoSaveHighScore.addEventListener('change', saveSettings);
    soundEffects.addEventListener('change', saveSettings);
});
