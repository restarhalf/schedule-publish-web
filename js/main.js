document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');

    const androidBtn = document.getElementById('android-dl-btn');
    const appleBtn = document.getElementById('apple-dl-btn');
    const androidText = document.getElementById('dl-text');
    const appleText = document.getElementById('ios-dl-text');
    const versionInfo = document.getElementById('version-info');
    const yearElement = document.getElementById('year');

    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        htmlElement.classList.toggle('dark', theme === 'dark');
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    const onSystemThemeChange = (event) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', onSystemThemeChange);
    } else {
        mediaQuery.addListener(onSystemThemeChange);
    }

    const replaceApkToIpa = (androidUrl) => androidUrl.replace(/\.apk(?=($|\?|#))/i, '.ipa');

    const syncPlatformLinks = (androidUrl) => {
        if (androidBtn) {
            androidBtn.href = androidUrl;
        }
        if (appleBtn) {
            appleBtn.href = replaceApkToIpa(androidUrl);
        }
    };

    if (androidBtn) {
        syncPlatformLinks(androidBtn.href);
    }

    const fetchLatestRelease = async () => {
        if (!versionInfo || !androidBtn) {
            return;
        }

        versionInfo.textContent = '正在检查最新版本...';

        try {
            const response = await fetch('https://gitee.com/api/v5/repos/restarhalf/schedule/releases/latest');
            if (!response.ok) {
                throw new Error(`Bad status: ${response.status}`);
            }

            const data = await response.json();
            const latestVersion = data.tag_name && data.tag_name.trim();
            if (!latestVersion) {
                throw new Error('Missing tag_name');
            }

            const latestAndroidUrl = `https://gitee.com/restarhalf/schedule/releases/download/${latestVersion}/app-release.apk`;
            syncPlatformLinks(latestAndroidUrl);

            if (androidText) {
                androidText.textContent = '下载 Android 版';
            }
            if (appleText) {
                appleText.textContent = '下载 Apple 版';
            }

            versionInfo.textContent = `最新版本：${latestVersion}`;
        } catch (error) {
            versionInfo.textContent = '无法获取最新版本，已显示默认下载链接。';
        }
    };

    fetchLatestRelease();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
});