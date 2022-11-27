class ThemeManager {
  constructor() {
    this.mainKey = 'prefers-color-scheme';
    this.darkModeMediaQuery = window.matchMedia(`(${this.mainKey}: ${ThemeManager.THEMES.dark})`);
    this.theme = ThemeManager.THEMES.light;
    this.init();
    this.bindEvents();
  }

  init() {
    const themefromStorage = window.localStorage.getItem(this.mainKey);
    if (themefromStorage) {
      this.theme = themefromStorage;
    } else {
      this.theme = this.darkModeMediaQuery.matches ? ThemeManager.THEMES.dark : ThemeManager.THEMES.light;
    }
    this.switch(this.theme);
  }

  bindEvents() {
    this.darkModeMediaQuery.addListener((e) => {
      const isDarkMode = e.matches;
      this.switch(isDarkMode ? ThemeManager.THEMES.light : ThemeManager.THEMES.dark);
    });
  }

  toggle() {
    const isDarkMode = this.theme === ThemeManager.THEMES.dark;
    this.switch(isDarkMode ? ThemeManager.THEMES.light : ThemeManager.THEMES.dark);
  }

  switch(theme = ThemeManager.THEMES.light) {
    this.theme = theme;
    window.localStorage.setItem(this.mainKey, this.theme);
    document.documentElement.setAttribute(this.mainKey, this.theme);
  }

  getTheme() {
    return this.theme;
  }
}

ThemeManager.THEMES = {
  light: 'light',
  dark: 'dark',
};

export default ThemeManager;
