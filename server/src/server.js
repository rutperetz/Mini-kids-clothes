import 'dotenv/config';       
console.log('DEBUG MONGODB_URI =', process.env.MONGODB_URI);

/*Running the server */

import app from './app.js';     
import { connectDB } from './config/db.js'; 

const PORT = process.env.PORT || 3000;


(async () => {
  
  await connectDB();

  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
