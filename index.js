import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// Inisialisasi aplikasi ketika DOM siap
document.addEventListener('DOMContentLoaded', () => {
  // Hide the splash screen
  SplashScreen.hide();

  // Set status bar style
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#121212' });

  // Handle hardware back button on Android
  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });

  // Inisialisasi app lainnya
  initApp();
});

function initApp() {
  // Custom app initialization code
  console.log('RememberMe app initialized');
  
  // Redirect to login if needed
  if (!isLoggedIn()) {
    window.location.href = 'signin.html';
  }
}

function isLoggedIn() {
  // Check if user is logged in
  return localStorage.getItem('user') !== null;
} 