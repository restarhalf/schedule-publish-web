document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    let currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

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