// Firebase設定ファイル
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// あなたのFirebaseプロジェクト設定
// 注: 実際のアプリケーションでは、環境変数として設定することをお勧めします
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };