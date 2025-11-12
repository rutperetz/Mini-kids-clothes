import mongoose from 'mongoose';

/**
 * מחבר את האפליקציה למסד הנתונים ב־MongoDB Atlas
 * משתמש במחרוזת חיבור מתוך קובץ .env
 */
export async function connectDB() {
  // קורא את מחרוזת החיבור ואת שם בסיס הנתונים מהסביבה
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'shopdb';

  // הגנה: אם אין URI בקובץ .env – נעצור עם הודעה ברורה
  if (!uri) {
    console.error('❌ חסר MONGODB_URI בקובץ .env (בתיקיית server)');
    process.exit(1);
  }

  try {
    // מייצר חיבור למסד. שימי לב: מעבירים גם dbName כדי לעבוד בבסיס נתונים הרצוי
    await mongoose.connect(uri, { dbName });

    // אם הגענו לכאן – ההתחברות הצליחה
    console.log('✅ MongoDB connected:', dbName);
  } catch (err) {
    // במקרה של שגיאה – מדפיסים הודעה ויוצאים מהתהליך
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
