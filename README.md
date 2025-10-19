# HR Helper  
**Automate your HR flow with AI.**  

---

## features

- **Candidate Form** — simple and clean application form (customizable with admin pannel soon).  
- **AI Evaluation** — automatic resume analysis using AI.  
- **Notifications** — instant email alerts for new relevant applications.  
- **Admin Panel (coming soon)** — adjust required stack and experience levels.  
- **Auto-Reject (coming soon)** — candidates below a certain threshold are filtered out automatically.

## run locally with docker
### prerequisites 
install docker + docker compose 
https://www.docker.com/products/docker-desktop/

before deploying get to the Sendgrid sendgrid.com (used for sending mails) and get the API key, it will be necesary for automatization.




## How It Works

1. A candidate submits a form with their resume (PDF).
2. The backend parses the resume text using pdf-parse.
3. AI evaluates how well the candidate fits the desired stack.
4. The system automatically:
* Rejects low-scoring applicants
* Notifies HR about qualified ones
