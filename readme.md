# To run this project
### ensure you have docker-desktop installed

#### clone this repo 
> git clone https://github.com/majorhenry/loanapplication-api-v1.git

#### Running the application for the first time, run the following command to build and start the container:

`docker compose up --build -d`

>If it is not the first time, run the command below to start the container:

`docker compose up -d`

>To Stop the container:

`docker compose down`

>To view logs

`docker compose logs`

# Schema definition and explanation.
```
The schema is located in the db directory, and every action taken have been commmented for easy readabity. To ensure that no negative value can be sent by customers to columns, I ensured that values are greater than zero and query are parameterized. Furthermore after using the querying the database with pool method, I always used client.release(); to ensure no data leaks.
```
# Explanation of security and CI/CD decisions.
```
Security decision in the CI/CD is to ensure that sensitive informations where all passed through github actions secrets.
```

# A short Write-up
```
In this project, I used AI (chatgpt) extensivly as a search engine for debugging, summarizing library documentation and generating basic template before advancing the project, to be more profesional and easy to maintain. 

To avoid a situation where this project works well on my machine but fails in production, I decided to use docker to ensure consistency throught out the project. I also used .env file to store sensitive informations and are passed securely when needed. In this project user input values are passed through try and catch block to handle  error, then the values are validated using "express-validator" , which output valuable error message if the input value is a wrong value type.
```

# ✅ Infrastructure & AWS Deployment
## 1. Basic Deployment Setup for AWS Elastic Beanstalk


> AWS Elastic Beanstalk is a Platform-as-a-Service (PaaS) that lets you deploy and scale web applications quickly without managing the underlying infrastructure.

### Environment Configuration

| Component	        |    Value
|-------------------|-----------------------------------
| Platform	        |    Node.js (choose version used by app) for this project Docker
| Environment Type	| Web server environment
| Instance Type	    |    t2.micro or t3.micro (free tier eligible)
| Load Balancer	    |   Optional (for single instance apps)
| Database	        |   RDS (PostgreSQL) — set up separately
| Region	        |    Choose closest region (e.g., us-east-1)

### Directory Structure
Project root should include:
```
.
├──  index.js        # Main Node.js entry point
├── package.json
├── Procfile                 # Tells Beanstalk how to run app
├── .elasticbeanstalk/      # Created by EB CLI
└── .gitignore
```

## Procfile example:
```
web: node index.js
```

## Deployment Steps Using EB CLI
### Install the EB CLI
```
pip install awsebcli
```

### Initialize the Project
```
eb init
```
* Choose region

* Select Node.js platform

* Link to a Git repo if asked

### Create Environment
```
eb create loanapp-env
```

### Set Environment Variables
### Use Elastic Beanstalk console or:
```
eb setenv NODE_ENV=production DB_HOST=db-endpoint DB_USER=... DB_PASSWORD=...
```

### Deploy the App
```
eb deploy
```
### Monitor Logs
```
eb logs
```

### Open in Browser
```
eb open
```

## Security Best Practices
Store secrets like database credentials in environment variables.

Ensure the RDS instance is in the same VPC and accessible by the Beanstalk EC2 instance.

Use Security Groups to allow internal connections only.

Enable HTTPS in Beanstalk configuration for production.





## 2. Securely Connecting to PostgreSQL (AWS RDS)
To connect securely:

* Use environment variables to store credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)

* Ensure RDS is in a VPC that allows connections from Elastic Beanstalk app's EC2 instance

* Did not hardcode secrets — use Elastic Beanstalk environment settings or .env file (for local dev only)

* Use SSL if needed by adding ssl: { rejectUnauthorized: false } to pg config


## 3. Deployment Instructions & Configuration
 **Prerequisites**

AWS CLI configured ( *aws configure* )

EB CLI installed ( *pip install awsebcli* )

**.env** file for local, Elastic Beanstalk environment variables for production

## Step-by-Step Setup
 Initialize Elastic Beanstalk
```
eb init -p node.js loanapplication-api --region us-east-1
```

* Choose region

* Link to an existing application or create new

 Create Environment
```
eb create loanapp-env --instance_type t3.micro
```
 Set Environment Variables

```
eb setenv DB_HOST=-rds-endpoint \
           DB_USER=postgres \
           DB_PASSWORD=password \
           DB_NAME=loanappdb \
           DB_PORT=5432 \
           NODE_ENV=production
```

 Deploy App
```
eb deploy
```
## Required Files in Root of Project
***Dockerfile*** (if using Docker):

***.elasticbeanstalk/config.yml***
> Created automatically by eb init

Procfile
```
web: node index.js
```

# ✅  Security 
## IAM Policy and Role Setup for Secure Access to AWS Resources
### 1. Principles of IAM for Application Security
* Least Privilege: Grant only the permissions required.

* Separation of Roles: Use different roles for CI/CD, EC2/Beanstalk, and developers.

* Use Roles Over Access Keys: Never hardcode AWS credentials—use IAM roles.


1. Secure Access
Set DB_HOST, DB_USER, DB_PASSWORD, etc., as environment variables using the AWS Console or:

```
eb setenv DB_HOST=... DB_USER=... DB_PASSWORD=...
```
* Ensure RDS security group allows inbound access from the Beanstalk EC2 security group.

## API Security, Input Validation & Preventing Vulnerabilities
###  Input Validation, Prevent SQL Injection
* Always use parameterized queries or ORM like Pg.

```
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```
HTTP Headers

### Use helmet to set secure headers.

>const helmet = require('helmet');
>app.use(helmet());

### CORS Policy
* Whitelist frontend domains to prevent unauthorized access.

Use cors middleware:
```
app.use(cors({ origin: 'https://your-frontend.app' }));

```



## ✅ CI/CD Workflow (Conceptual or Implemented)
### Automated Testing
Every time someone pushes a commit or opens a pull request (PR).


The pipeline spins up a fresh environment.

Installs dependencies using yarn install.

Runs tests using a test runner like jest or mocha, but the test is not implemented in this project.

Generally this ensures new code doesn’t break existing functionality. The code snippent that ensure this functionality is shown below
```
- name: Install dependencies
  run: yarn install

- name: Run tests
  run: yarn test
```

### Code Reviews
Happens whenever a pull request is opened or updated.

The automated checks (tests + linting) run before a PR can be merged.

Code owners or team members in charge of the repo are requested to review and approve the changes.

Optionally, tools like ESLint, Prettier, or SonarCloud are used to enforce style and quality standards.

### Deployments
Deployment is achieved by adding `deploy` command to `jobs` block, it also requires bash command,for example in case of AWS elastic Beanstalk:
```
- name: Deploy to AWS (example)
  run: |
    eb deploy --profile default
    echo "Deployment complete"
```
After PR is merged into main or release branches.
The pipeline builds the production-ready app.

Connects to hosting provider, in this case aws.

Deploys the app using the appropriate method Docker.
