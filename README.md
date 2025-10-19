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
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

before deployment, create an account on [SendGrid](https://sendgrid.com/) — it’s used for sending automated emails.  
you’ll need to generate a **SendGrid API key** in settings tab and add it to your environment file later.

### setup instructions

1. git clone https://github.com/kitotp/hr_helper
2. cp apps/backend/.env.example apps/backend/.env
3. docker compose up -d --build




## How It Works

1. A candidate submits a form with their resume (PDF).
2. The backend parses the resume text using pdf-parse.
3. AI evaluates how well the candidate fits the desired stack.
4. The system automatically:
* Rejects low-scoring applicants
* Notifies HR about qualified ones
