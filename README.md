# Deploying a Node.js App to an Azure Virtual Machine with CI/CD

## 📌 Project Overview
This project demonstrates how to deploy a **Node.js application** to an **Azure Virtual Machine (VM)** using **GitHub Actions** for continuous integration and continuous deployment (CI/CD). It automates the deployment process, ensuring that every push to the `main` branch updates the application on the VM.

## 🚀 Features
- **Automated Deployment** via GitHub Actions
- **Process Management** using PM2
- **Reverse Proxy Setup** with Nginx
- **Secure SSH Deployment** with GitHub Secrets
- **Scalable and Maintainable Architecture**

---

## 📂 Project Structure
```
├── index.js          # Main Node.js application file
├── package.json      # Dependencies and scripts
├── package-lock.json # Dependency lockfile
└── .github/workflows/deploy.yml # CI/CD workflow
```

---

## ✅ Steps to Accomplish CI/CD on Azure VM

### **1️⃣ Setup Azure VM & SSH Access**
1. **Create an Azure Virtual Machine (VM)** with Ubuntu.
2. **Connect to the VM via SSH:**
   ```sh
   ssh azureuser@<VM_PUBLIC_IP>
   ```
3. **Update the system:**
   ```sh
   sudo apt update && sudo apt upgrade -y
   ```

---

### **2️⃣ Install Required Packages on VM**
1. **Install Node.js & npm:**
   ```sh
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. **Install PM2 (process manager):**
   ```sh
   sudo npm install -g pm2
   ```
3. **Install Nginx (reverse proxy):**
   ```sh
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

---

### **3️⃣ Clone GitHub Repository & Run the App**
1. **Move to a working directory:**
   ```sh
   cd /home/azureuser
   ```
2. **Clone your repository:**
   ```sh
   git clone https://github.com/yourusername/your-nodejs-project.git
   cd your-nodejs-project
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Run the app using PM2:**
   ```sh
   pm2 start index.js --name "node-app"
   pm2 save
   pm2 startup
   ```

---

### **4️⃣ Configure Nginx as a Reverse Proxy**
1. **Edit the Nginx configuration:**
   ```sh
   sudo nano /etc/nginx/sites-available/default
   ```
2. **Replace the content with:**
   ```nginx
   server {
       listen 80;
       server_name your_domain_or_ip;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. **Restart Nginx:**
   ```sh
   sudo systemctl restart nginx
   ```
4. **Allow HTTP traffic through the firewall:**
   ```sh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

---

### **5️⃣ Set Up GitHub Actions for CI/CD**
1. **Create a GitHub Actions workflow file:**
   ```sh
   mkdir -p .github/workflows
   nano .github/workflows/deploy.yml
   ```
2. **Add the following content:**
   ```yaml
   name: Deploy Node.js App to Azure VM

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout Repository
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: 18

         - name: Install Dependencies
           run: npm install

         - name: Run Tests
           run: npm test

         - name: SSH into VM and Deploy
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.AZURE_VM_IP }}
             username: ${{ secrets.AZURE_VM_USER }}
             key: ${{ secrets.AZURE_VM_SSH_KEY }}
             script: |
               cd /home/azureuser/your-nodejs-project
               git pull origin main
               npm install
               pm2 restart node-app
   ```
3. **Add GitHub Secrets (Settings > Secrets and Variables > Actions):**
   - `AZURE_VM_IP` → Your VM’s public IP
   - `AZURE_VM_USER` → Your VM username (default: `azureuser`)
   - `AZURE_VM_SSH_KEY` → Your **private SSH key**

4. **Push the workflow file to GitHub:**
   ```sh
   git add .
   git commit -m "Added CI/CD workflow"
   git push origin main
   ```

---

### **6️⃣ Test the CI/CD Pipeline**
1. **Go to GitHub → Your Repository → Actions.**
2. **Check if the deployment was successful.**
3. **Visit your app in a browser:**
   ```
   http://<VM_PUBLIC_IP>
   ```

---

## 🎯 Bonus: Secure Your App with SSL
Enable HTTPS using Let's Encrypt:
```sh
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🎉 Conclusion
You have successfully set up **CI/CD for a Node.js app on an Azure Virtual Machine** using **GitHub Actions**. Now, every push to the `main` branch will **automatically deploy the latest changes** to your Azure VM!

---

## 📌 Troubleshooting
- **Check Nginx logs:**
  ```sh
  sudo journalctl -u nginx --no-pager | tail -n 20
  ```
- **Check PM2 logs:**
  ```sh
  pm2 logs
  ```
- **Manually restart services:**
  ```sh
  sudo systemctl restart nginx
  pm2 restart node-app
  ```

---

## 📢 Need Help?
Feel free to open an issue or reach out for any assistance. 🚀

