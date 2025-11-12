import 'dotenv/config';          // טוען את משתני הסביבה מתוך .env
console.log('DEBUG MONGODB_URI =', process.env.MONGODB_URI);

import app from './app.js';      // האפליקציה עצמה (Express)
import { connectDB } from './config/db.js'; // פונקציית החיבור שכתבנו

const PORT = process.env.PORT || 3000;

// IIFE – מריצים פונקציה אסינכרונית מיד
(async () => {
  // 1) מתחברים למסד
  await connectDB();

  // 2) רק אם החיבור הצליח – מתחילים להאזין לפורט
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
