# 🔌 Database Connection Guide

## 📋 Connection Information

### PostgreSQL Direct Connection String

**Option 1 (URL Encoded - Recommended):**
```
postgresql://postgres:Shivam%409142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres
```

**Option 2 (If Option 1 doesn't work):**
```
postgresql://postgres:Shivam@9142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres
```

**Note:** Password contains `@` which should be URL-encoded as `%40` in connection strings.

### Connection Details (Parsed)

- **Host:** `db.fnqogmrilacriqbawahx.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **Username:** `postgres`
- **Password:** `Shivam@9142`

---

## 🔧 How to Use

### For Database Clients (pgAdmin, DBeaver, etc.)

1. **Open your database client**
2. **Create new connection**
3. **Use these settings:**
   - **Host:** `db.fnqogmrilacriqbawahx.supabase.co`
   - **Port:** `5432`
   - **Database:** `postgres`
   - **Username:** `postgres`
   - **Password:** `Shivam@9142`

**Or use the connection string directly:**
```
postgresql://postgres:Shivam%409142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres
```

**Note:** If the encoded version doesn't work, try:
```
postgresql://postgres:Shivam@9142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres
```

---

## 📝 For This Project

### Current Setup (Frontend)

This project uses **Supabase JS SDK** (REST API), not direct PostgreSQL connections.

**Configuration File:** `supabaseClient.js`

```javascript
const SUPABASE_URL = 'https://fnqogmrilacriqbawahx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Why Not Direct PostgreSQL?

- ✅ **Security:** Anon key is safe for frontend (has RLS policies)
- ✅ **Easy:** No need to manage database connections
- ✅ **Scalable:** Supabase handles connection pooling
- ✅ **Features:** Built-in auth, storage, real-time

---

## 🛠️ When to Use Direct PostgreSQL Connection

Use direct PostgreSQL connection for:

1. **Database Management Tools:**
   - pgAdmin
   - DBeaver
   - TablePlus
   - DataGrip

2. **Backend Services:**
   - Node.js server
   - Python scripts
   - Data migrations

3. **Advanced Queries:**
   - Complex SQL operations
   - Database administration
   - Performance analysis

---

## 🔒 Security Notes

### ⚠️ Important:

1. **Never commit passwords to public repositories**
2. **Use environment variables in production**
3. **Keep connection strings secure**
4. **Don't share credentials publicly**

### For Production:

Create `.env` file (add to `.gitignore`):

```env
POSTGRES_CONNECTION_STRING=postgresql://postgres:password@host:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## 📁 Files

- **`database_config.js`** - Connection configuration file
- **`supabaseClient.js`** - Supabase client (used by project)
- **`DATABASE_CONNECTION_GUIDE.md`** - This file

---

## 🎯 Quick Reference

**For Frontend (Current Project):**
- Use: `supabaseClient.js`
- Method: Supabase JS SDK
- Connection: REST API

**For Database Clients:**
- Use: PostgreSQL connection string
- Method: Direct connection
- Connection: `postgresql://postgres:Shivam@9142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres`

---

## ✅ Summary

- ✅ Connection string added to `database_config.js`
- ✅ Connection details documented
- ✅ Usage guide provided
- ✅ Security notes included

**Connection string ready to use!** 🔌

