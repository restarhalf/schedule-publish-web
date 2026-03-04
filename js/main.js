document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // 检查本地存储的主题或系统偏好
    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 应用主题
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    // 初始设置
    let currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // 切换按钮点击事件
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // 动态获取最新版本下载链接
    const fetchLatestRelease = async () => {
        const dlBtn = document.getElementById('android-dl-btn');
        const dlText = document.getElementById('dl-text');
        const versionInfo = document.getElementById('version-info');
        
        if (!dlBtn || !versionInfo) return;

        try {
            const response = await fetch('https://gitee.com/api/v5/repos/restarhalf/schedule/releases/latest');
            if (response.ok) {
                const data = await response.json();
                const latestVersion = data.tag_name; 
                
                // 更换下载链接并更新提示信息
                if (latestVersion) {
                    dlBtn.href = `https://gitee.com/restarhalf/schedule/releases/download/${latestVersion}/app-release.apk`;
                    dlText.textContent = `下载 Android 版 `;
                    versionInfo.textContent = `最新版本: ${latestVersion} `;
                }
            } 
        } catch (error) {
           versionInfo.textContent = '无法获取最新版本信息';
        }
    };

    fetchLatestRelease();
});