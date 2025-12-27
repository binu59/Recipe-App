# 🚀 Recipe App - Deployment Guide

## Pre-Deployment Checklist

- [ ] All CRUD operations tested locally
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Backend running without errors
- [ ] MongoDB connection working
- [ ] Frontend builds without warnings
- [ ] Environment variables configured
- [ ] Tests passed (manual testing guide available)

---

## Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Frontend - Vercel Deployment

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

3. **Configure Environment**
   - Set `REACT_APP_API_URL` in Vercel project settings
   - Use your backend URL: `https://your-backend.herokuapp.com/recipes`

#### Backend - Heroku Deployment

1. **Create Heroku Account**
   - Visit https://www.heroku.com
   - Sign up

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_mongodb_uri
   git push heroku main
   ```

4. **Verify Deployment**
   ```bash
   heroku logs --tail
   ```

---

### Option 2: AWS (Frontend + Backend)

#### Frontend - AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   - Create S3 bucket
   - Upload `build` folder contents
   - Enable static website hosting

3. **Setup CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Cache and CDN configuration

#### Backend - AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier eligible)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   npm install -g pm2
   ```

3. **Deploy Backend**
   ```bash
   git clone your-repo
   cd RecipeApp/backend
   npm install
   pm2 start server.js --name "recipe-app"
   pm2 startup
   pm2 save
   ```

4. **Setup Domain**
   - Use Route 53 for DNS
   - Point to EC2 elastic IP

---

### Option 3: Docker + Railway

#### Dockerfile for Backend

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Dockerfile for Frontend

```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy to Railway

1. **Connect Repository**
   - Push to GitHub
   - Connect with Railway

2. **Configure Services**
   - Add backend service from Dockerfile
   - Add frontend service from Dockerfile

3. **Set Environment Variables**
   - `MONGODB_URI` for backend
   - `REACT_APP_API_URL` for frontend

---

### Option 4: Netlify + Render

#### Frontend - Netlify

1. **Connect Repository**
   - Create account at https://netlify.com
   - Connect GitHub repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: build
   ```

3. **Set Environment Variables**
   - `REACT_APP_API_URL`

#### Backend - Render

1. **Create Account**
   - Visit https://render.com

2. **Create Web Service**
   - Connect GitHub repository
   - Select backend directory
   - Set environment variables

---

## Environment Configuration for Production

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/recipe-db
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.com/recipes
```

---

## Database Optimization

### MongoDB Atlas Best Practices

1. **Create Production Database**
   - Separate from development
   - Enable encryption at rest
   - Enable backups

2. **Security**
   - Create database user
   - Set strong passwords
   - Whitelist IP addresses
   - Enable SSL/TLS

3. **Monitoring**
   - Enable performance advisor
   - Setup alerts
   - Monitor query performance

4. **Backup Strategy**
   - Enable automated backups
   - Test restore procedures
   - Retention policy

---

## Performance Optimization

### Frontend

1. **Build Optimization**
   ```bash
   npm run build
   # Check size
   npm install -g serve
   serve -s build
   ```

2. **Image Optimization**
   - Use optimized image URLs
   - Consider CDN for images
   - Lazy load images

3. **Code Splitting**
   - React Router already enables this
   - Monitor bundle size

### Backend

1. **Database Indexing**
   ```javascript
   // Add to RecipeModel if needed
   recipeSchema.index({ name: 1 });
   recipeSchema.index({ createdAt: -1 });
   ```

2. **Caching Strategy**
   - Consider Redis for frequently accessed recipes
   - Implement rate limiting
   - Use HTTP caching headers

3. **Server Monitoring**
   - Monitor CPU and memory
   - Setup alerts for errors
   - Log important events

---

## SSL/HTTPS Setup

### Let's Encrypt (Free)

1. **Using Certbot**
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. **Configure HTTPS**
   - Update backend to use SSL certificate
   - Redirect HTTP to HTTPS
   - Update frontend API URL to HTTPS

---

## Domain Setup

### Register Domain
- GoDaddy, NameCheap, Route 53, etc.

### DNS Configuration
```
API: api.yourdomain.com -> Your backend URL
WWW: www.yourdomain.com -> Your frontend URL
```

### Subdomain Strategy
```
yourdomain.com        -> Frontend (Vercel/Netlify)
api.yourdomain.com    -> Backend (Heroku/Render)
```

---

## Monitoring & Logging

### Backend Monitoring

1. **Application Logging**
   ```javascript
   const logger = require('./logger');
   logger.info('Recipe created', { recipeId, userId });
   ```

2. **Error Tracking**
   - Use Sentry or similar
   - Track all errors
   - Get alerts for critical issues

3. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor /health endpoint
   - Get notifications if down

### Frontend Monitoring

1. **Error Tracking**
   - Use Sentry for frontend errors
   - Track user behavior
   - Monitor performance

2. **Analytics**
   - Add Google Analytics
   - Track user engagement
   - Monitor conversion rates

---

## Continuous Deployment (CD)

### GitHub Actions Workflow

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - name: Deploy Frontend
        run: vercel --prod
      - name: Deploy Backend
        run: git push heroku main
```

---

## Post-Deployment Testing

### Smoke Tests

1. **Frontend**
   - [ ] Homepage loads
   - [ ] Can create recipe
   - [ ] Can view recipe
   - [ ] Can edit recipe
   - [ ] Can delete recipe
   - [ ] Search works
   - [ ] Responsive on mobile

2. **Backend**
   - [ ] API responds to requests
   - [ ] Database connections work
   - [ ] CORS enabled
   - [ ] Error handling works

3. **Database**
   - [ ] MongoDB connection works
   - [ ] Reads and writes function
   - [ ] Backups are available

---

## Rollback Strategy

### If Something Goes Wrong

1. **Quick Rollback**
   ```bash
   # Vercel
   vercel rollback
   
   # Heroku
   heroku releases
   heroku rollback v123
   
   # Docker
   docker pull previous-image
   docker run previous-image
   ```

2. **Data Recovery**
   - Use MongoDB backups
   - Restore from point-in-time
   - Test recovery procedures

---

## Cost Estimation

### Free/Low-Cost Options

| Service | Cost | Tier |
|---------|------|------|
| Vercel | Free | Frontend (50GB/month) |
| Render | Free | Backend (limited) |
| MongoDB Atlas | Free | Database (512MB) |
| Netlify | Free | Frontend alternative |
| Railway | Paid | Backend ($5-20/month) |

### Production-Ready

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Pro | $20/month | Better performance |
| Heroku Standard | $7/month | 24/7 uptime |
| MongoDB M10 | $99/month | Production database |
| **Total** | **~$126/month** | Professional setup |

---

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] Database credentials not in code
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (if needed)
- [ ] Rate limiting enabled
- [ ] Authentication/authorization (if added)

---

## Maintenance Plan

### Weekly
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Review performance metrics

### Monthly
- [ ] Test backup restoration
- [ ] Security updates
- [ ] Database optimization
- [ ] Review user feedback

### Quarterly
- [ ] Performance tuning
- [ ] Security audit
- [ ] Database cleanup
- [ ] Cost analysis

---

## Support & Monitoring

### Getting Help

1. **Vercel Support**
   - https://vercel.com/support

2. **Heroku Support**
   - https://help.heroku.com

3. **MongoDB Support**
   - https://www.mongodb.com/support

4. **Community**
   - Stack Overflow
   - GitHub Issues
   - Discord communities

### Emergency Contacts

- Deployment: [Your provider support]
- Database: [Your provider support]
- Domain: [Your registrar support]

---

## Deployment Checklist

```
BEFORE DEPLOYMENT
☐ All tests pass
☐ No console errors
☐ Environment variables configured
☐ Database backup taken
☐ Staging environment tested
☐ Performance validated

DURING DEPLOYMENT
☐ Monitor logs
☐ Verify endpoints responding
☐ Check database connectivity
☐ Test all CRUD operations

AFTER DEPLOYMENT
☐ Run smoke tests
☐ Monitor error logs
☐ Check application performance
☐ Notify team
☐ Document deployment
☐ Plan rollback if needed
```

---

## Success! 🎉

Your Recipe App is now live! 

**Next Steps:**
1. Monitor application performance
2. Gather user feedback
3. Plan enhancements
4. Scale as needed

**Enjoy!**
