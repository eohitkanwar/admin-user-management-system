# MongoDB Atlas Connection Instructions

## 1. Get Your Connection String
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click "Connect" 
4. Choose "Connect your application"
5. Select "Node.js" driver
6. Copy the connection string

## 2. Connection String Format
mongodb+srv://username:password@cluster.mongodb.net/database-name

## 3. Set Environment Variable
Create/update your .env file:
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database

## 4. Update config/db.js
Replace the placeholder with your actual connection string

## 5. Whitelist IP Address
In MongoDB Atlas:
- Go to Network Access
- Add your current IP address
- Or use 0.0.0.0/0 for any IP (development only)

## 6. Database User
Make sure you have a database user with:
- Username (from connection string)
- Password (from connection string)
- Read/Write permissions on your database
