 
## Employee Reiew System


Hello there!! 

I create an WEB App that allows employees to submit feedback toward each other’s performance
 
- Read DOC HERE:  https://arun-kumar-95.github.io/Employee-review-app/
- WATCH LIVE DEMO : https://review-app.onrender.com
 
 


## How to setup project locally:

To setup the files locally on a system follow these simple steps.

step 1: 

Visit this url: https://github.com/Arun-kumar-95/Reviewsystem

Step: 2

- Download the zip file and extract it 
- Open the file with your favourite editor

Step: 3

- Open the terminal, use "npm install" to install all dependencies or packages
 
 Step: 4

# Setting the enviromental variables

- PORT = 5000
- DATABASE_NAME = "your databse name"
- DATABASE_URL = 'your databse uri'
- JWT_SECRET = 'somerandomtext'
- JWT_EXPIRES = 14h


- TWILIO_SID = 'your twilio sid'
- TWILIO_AUTH_TOKEN = 'your twilio auth token'
- TWILIO_PHONE = 'your twilio phone number'


- CLOUD_NAME = 'your cloud name'
- CLOUD_KEY = 'your cloud key'
- CLOUD_SECRET_KEY = 'your cloud secret key'





## How to start server

- Go to package.json file
- Add script such as:  
"start": "nodemon ./src/index.js"

- Finally go on the terminal 
- To start the server use "npm start" 
## Let's Talk About Routes

These are the routes which you will fing in this peoject ans their uses.

- localhost:5000/ =>  This is the main home page of the web app.

- /login => where you will login using email and password.

- /register => where you can register yourself as an employee 

- Note: Initially there will be only one admin and rest will register itself as employee 

when the admin verifies the employee then only it can login using the email and password
 
 - /dashboard =>  Once the employee login successsfully then according to their role will redirect to the dashboard 
here he can see different section of the dashboard


## Admin routes are

 - /dashboard/employees => Here you can see  all employee list and details 

 - /dashboard/notifications => This route wil show all the notifications

 - /dashboard/manage => Here you can add / update and remove the employee 

 I have also added the search functionality to easily manage employee.

 - /dashboard/update/:id  =>  This route is for updating the emplyee details

 - /dashboard/profile/:id => You can visit to the particult employee profile and grant the access to give feedback also update the issue is any one have raised.

 - /dashboard/logout => This is logout route which helps us to come logging you out.

 - /dashboard/upload/:id  => This route helps you to change the profile pic 


## Employee routes

-  /dashboard/feedback" => This roytes helps you to give feedback among different employee only if the admin has granted the access.

- /dashboard/doubt => You can raise your doubt if anyone is facing issue

- /dashboard/notifications => Only he can see his notification if any arrives like feedback notification , doubt solved notification

-/dashboard/upload/:id => This route helps you to change the profile pic of the employee
 
  
 
 


## Authors

- Arun kumar: https://github.com/Arun-kumar-95

- It was an awesome exprerience, to create an Employee review system.


